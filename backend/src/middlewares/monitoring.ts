import { Request, Response, NextFunction } from 'express';
import { performanceLogger, securityLogger, auditLogger } from '../utils/logger';
import { AuthRequest } from './auth';
import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000, 2000, 5000]
});

export const prometheusMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startEpoch = Date.now();
  res.on('finish', () => {
    const responseTimeInMs = Date.now() - startEpoch;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode.toString())
      .observe(responseTimeInMs);
  });
  next();
};

export const prometheusMetricsRoute = (req: Request, res: Response) => {
  res.set('Content-Type', client.register.contentType);
  res.end(client.register.metrics());
};

export interface MonitoringMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  slowRequests: number;
  securityEvents: number;
}

class MonitoringService {
  private metrics: MonitoringMetrics = {
    requestCount: 0,
    errorCount: 0,
    averageResponseTime: 0,
    slowRequests: 0,
    securityEvents: 0
  };

  private responseTimes: number[] = [];
  private readonly SLOW_REQUEST_THRESHOLD = 2000; // 2 seconds

  // Request monitoring middleware
  requestMonitor = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    this.metrics.requestCount++;

    // Log request details
    performanceLogger.logApiResponse(
      req.method,
      req.url,
      0, // Will be updated after response
      Date.now() - startTime,
      {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: (req as AuthRequest).user?.id
      }
    );

    // Override res.end to capture response time
    const originalEnd = res.end;
    res.end = function(chunk?: any, encoding?: any) {
      const responseTime = Date.now() - startTime;
      
      // Update metrics
      this.responseTimes.push(responseTime);
      this.metrics.averageResponseTime = this.calculateAverageResponseTime();
      
      if (responseTime > this.SLOW_REQUEST_THRESHOLD) {
        this.metrics.slowRequests++;
        performanceLogger.logApiResponse(
          req.method,
          req.url,
          res.statusCode,
          responseTime,
          {
            slowRequest: true,
            threshold: this.SLOW_REQUEST_THRESHOLD,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            userId: (req as AuthRequest).user?.id
          }
        );
      }

      // Log API response
      performanceLogger.logApiResponse(
        req.method,
        req.url,
        res.statusCode,
        responseTime,
        {
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          userId: (req as AuthRequest).user?.id
        }
      );

      originalEnd.call(this, chunk, encoding);
    }.bind(this);

    next();
  };

  // Error monitoring middleware
  errorMonitor = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    this.metrics.errorCount++;

    // Log error details
    performanceLogger.logApiResponse(
      req.method,
      req.url,
      res.statusCode || 500,
      Date.now(),
      {
        error: err.message,
        stack: err.stack,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: (req as AuthRequest).user?.id
      }
    );

    next(err);
  };

  // Security monitoring middleware
  securityMonitor = (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    // Check for suspicious patterns
    this.checkSuspiciousActivity(req, ip, userAgent);

    next();
  };

  // Database query monitoring
  databaseMonitor = (query: string, duration: number, metadata?: any): void => {
    performanceLogger.logSlowQuery(query, duration, metadata);
  };

  // Health check endpoint
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await this.getSystemHealth();
      res.json({
        success: true,
        data: {
          status: health.status,
          timestamp: new Date().toISOString(),
          metrics: this.metrics,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Health check failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  };

  // Get current metrics
  getMetrics = (): MonitoringMetrics => {
    return { ...this.metrics };
  };

  // Reset metrics
  resetMetrics = (): void => {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      securityEvents: 0
    };
    this.responseTimes = [];
  };

  private calculateAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.responseTimes.length);
  }

  private checkSuspiciousActivity(req: Request, ip: string, userAgent: string): void {
    const suspiciousPatterns = [
      /script.*alert/i,
      /union.*select/i,
      /drop.*table/i,
      /<script/i,
      /javascript:/i,
      /onload=/i,
      /onerror=/i
    ];

    const url = req.url.toLowerCase();
    const body = JSON.stringify(req.body || {}).toLowerCase();

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url) || pattern.test(body)) {
        this.metrics.securityEvents++;
        securityLogger.logSuspiciousActivity('Malicious pattern detected', {
          pattern: pattern.toString(),
          url: req.url,
          method: req.method,
          ip,
          userAgent,
          body: req.body
        });
        break;
      }
    }

    // Check for rapid requests from same IP
    // This would require implementing rate limiting per IP
    // For now, we'll just log the activity
  }

  private async getSystemHealth(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy' }> {
    try {
      // Check database connection
      // Check memory usage
      const memoryUsage = process.memoryUsage();
      const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      // Check error rate
      const errorRate = this.metrics.requestCount > 0 
        ? (this.metrics.errorCount / this.metrics.requestCount) * 100 
        : 0;

      // Determine health status
      if (errorRate > 10 || memoryUsagePercent > 90) {
        return { status: 'unhealthy' };
      } else if (errorRate > 5 || memoryUsagePercent > 80 || this.metrics.slowRequests > 10) {
        return { status: 'degraded' };
      } else {
        return { status: 'healthy' };
      }
    } catch (error) {
      return { status: 'unhealthy' };
    }
  }
}

// Create singleton instance
const monitoringService = new MonitoringService();

// Export middleware functions
export const requestMonitor = monitoringService.requestMonitor;
export const errorMonitor = monitoringService.errorMonitor;
export const securityMonitor = monitoringService.securityMonitor;
export const databaseMonitor = monitoringService.databaseMonitor;
export const healthCheck = monitoringService.healthCheck;
export const getMetrics = monitoringService.getMetrics;
export const resetMetrics = monitoringService.resetMetrics;

export default monitoringService;
