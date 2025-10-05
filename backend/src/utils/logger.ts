import winston from 'winston';
import path from 'path';

// Custom log levels for healthcare system
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    audit: 5,
    security: 6,
    performance: 7
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
    audit: 'cyan',
    security: 'red bold',
    performance: 'blue'
  }
};

winston.addColors(customLevels.colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
);

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // Audit logs
    new winston.transports.File({
      filename: path.join('logs', 'audit.log'),
      level: 'audit',
      maxsize: 10485760,
      maxFiles: 30, // Keep audit logs longer
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // Security logs
    new winston.transports.File({
      filename: path.join('logs', 'security.log'),
      level: 'security',
      maxsize: 10485760,
      maxFiles: 30,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // Performance logs
    new winston.transports.File({
      filename: path.join('logs', 'performance.log'),
      level: 'performance',
      maxsize: 10485760,
      maxFiles: 10,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // Combined logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 10485760,
      maxFiles: 10
    })
  ]
});

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, stack, metadata }) => {
        const metaStr = metadata && Object.keys(metadata).length > 0 
          ? `\n${JSON.stringify(metadata, null, 2)}` 
          : '';
        return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
      })
    )
  }));
}

// Performance monitoring
export const performanceLogger = {
  startTimer: (label: string) => {
    const start = Date.now();
    return {
      end: (metadata?: any) => {
        const duration = Date.now() - start;
        logger.performance(`${label} completed`, {
          duration: `${duration}ms`,
          ...metadata
        });
        return duration;
      }
    };
  },

  logSlowQuery: (query: string, duration: number, metadata?: any) => {
    if (duration > 1000) { // Log queries slower than 1 second
      logger.performance('Slow database query detected', {
        query: query.substring(0, 200) + '...',
        duration: `${duration}ms`,
        ...metadata
      });
    }
  },

  logApiResponse: (method: string, url: string, statusCode: number, duration: number, metadata?: any) => {
    logger.performance('API Response', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ...metadata
    });
  }
};

// Security monitoring
export const securityLogger = {
  logFailedLogin: (email: string, ip: string, userAgent: string) => {
    logger.security('Failed login attempt', {
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });
  },

  logSuspiciousActivity: (activity: string, details: any) => {
    logger.security('Suspicious activity detected', {
      activity,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  logDataBreachAttempt: (resource: string, details: any) => {
    logger.security('Data breach attempt', {
      resource,
      ...details,
      timestamp: new Date().toISOString()
    });
  }
};

// Audit logging
export const auditLogger = {
  logUserAction: (userId: number, action: string, resource: string, details?: any) => {
    logger.audit('User action', {
      userId,
      action,
      resource,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  logDataAccess: (userId: number, resource: string, action: string, details?: any) => {
    logger.audit('Data access', {
      userId,
      resource,
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  logSystemEvent: (event: string, details?: any) => {
    logger.audit('System event', {
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  }
};

// Health monitoring
export const healthLogger = {
  logSystemHealth: (status: 'healthy' | 'degraded' | 'unhealthy', details?: any) => {
    logger.info('System health check', {
      status,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  logResourceUsage: (cpu: number, memory: number, disk: number) => {
    logger.info('Resource usage', {
      cpu: `${cpu}%`,
      memory: `${memory}%`,
      disk: `${disk}%`,
      timestamp: new Date().toISOString()
    });
  }
};

export default logger;
