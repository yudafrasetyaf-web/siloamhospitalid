import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AuthRequest } from './auth';

export interface AuditEvent {
  timestamp: string;
  userId?: number;
  userEmail?: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  method: string;
  url: string;
  statusCode?: number;
  requestBody?: any;
  responseBody?: any;
  error?: string;
}

export class AuditLogger {
  private static logEvent(event: AuditEvent): void {
    logger.info('AUDIT_EVENT', event);
  }

  static logAuthentication(req: Request, success: boolean, error?: string): void {
    const event: AuditEvent = {
      timestamp: new Date().toISOString(),
      action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      resource: 'AUTHENTICATION',
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      method: req.method,
      url: req.url,
      error: error
    };

    this.logEvent(event);
  }

  static logAuthorization(req: AuthRequest, resource: string, resourceId?: string, success: boolean = true): void {
    const event: AuditEvent = {
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      userEmail: req.user?.email,
      userRole: req.user?.role,
      action: success ? 'AUTHORIZED_ACCESS' : 'UNAUTHORIZED_ACCESS',
      resource,
      resourceId,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      method: req.method,
      url: req.url
    };

    this.logEvent(event);
  }

  static logDataAccess(req: AuthRequest, resource: string, resourceId?: string, action: string = 'READ'): void {
    const event: AuditEvent = {
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      userEmail: req.user?.email,
      userRole: req.user?.role,
      action: `DATA_${action.toUpperCase()}`,
      resource,
      resourceId,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      method: req.method,
      url: req.url
    };

    this.logEvent(event);
  }

  static logDataModification(req: AuthRequest, resource: string, resourceId?: string, action: string = 'UPDATE'): void {
    const event: AuditEvent = {
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      userEmail: req.user?.email,
      userRole: req.user?.role,
      action: `DATA_${action.toUpperCase()}`,
      resource,
      resourceId,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      method: req.method,
      url: req.url,
      requestBody: this.sanitizeRequestBody(req.body)
    };

    this.logEvent(event);
  }

  static logSystemEvent(eventType: string, details: any): void {
    const event: AuditEvent = {
      timestamp: new Date().toISOString(),
      action: `SYSTEM_${eventType.toUpperCase()}`,
      resource: 'SYSTEM',
      ipAddress: 'system',
      userAgent: 'system',
      method: 'SYSTEM',
      url: 'system',
      requestBody: details
    };

    this.logEvent(event);
  }

  static logSecurityEvent(eventType: string, req: Request, details?: any): void {
    const event: AuditEvent = {
      timestamp: new Date().toISOString(),
      action: `SECURITY_${eventType.toUpperCase()}`,
      resource: 'SECURITY',
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      method: req.method,
      url: req.url,
      requestBody: details
    };

    this.logEvent(event);
  }

  private static sanitizeRequestBody(body: any): any {
    if (!body) return body;
    
    const sanitized = { ...body };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'ssn', 'creditCard'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}

// Middleware untuk audit logging
export const auditMiddleware = (resource: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const originalSend = res.send;
    const originalJson = res.json;

    // Capture response
    res.send = function(body: any) {
      AuditLogger.logDataAccess(req, resource, req.params.id, 'READ');
      return originalSend.call(this, body);
    };

    res.json = function(body: any) {
      AuditLogger.logDataAccess(req, resource, req.params.id, 'READ');
      return originalJson.call(this, body);
    };

    next();
  };
};

// Middleware untuk audit data modification
export const auditModificationMiddleware = (resource: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const originalSend = res.send;
    const originalJson = res.json;

    // Capture response
    res.send = function(body: any) {
      const action = req.method === 'POST' ? 'CREATE' : 
                    req.method === 'PUT' || req.method === 'PATCH' ? 'UPDATE' : 
                    req.method === 'DELETE' ? 'DELETE' : 'MODIFY';
      
      AuditLogger.logDataModification(req, resource, req.params.id, action);
      return originalSend.call(this, body);
    };

    res.json = function(body: any) {
      const action = req.method === 'POST' ? 'CREATE' : 
                    req.method === 'PUT' || req.method === 'PATCH' ? 'UPDATE' : 
                    req.method === 'DELETE' ? 'DELETE' : 'MODIFY';
      
      AuditLogger.logDataModification(req, resource, req.params.id, action);
      return originalJson.call(this, body);
    };

    next();
  };
};
