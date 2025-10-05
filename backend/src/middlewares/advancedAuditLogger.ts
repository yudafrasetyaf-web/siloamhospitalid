import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import logger from '../utils/logger';

/**
 * Advanced Audit Logging Middleware
 * 
 * ISO 27001 Compliance:
 * - A.12.4.1: Event logging
 * - A.12.4.2: Protection of log information
 * - A.12.4.3: Administrator and operator logs
 * - A.12.4.4: Clock synchronization
 * 
 * Logs security-relevant events for compliance and forensics
 */

interface AuditLogEntry {
  timestamp: string;
  userId?: number;
  userEmail?: string;
  userRole?: string;
  ipAddress: string;
  userAgent: string;
  method: string;
  path: string;
  statusCode?: number;
  action: string;
  resource?: string;
  changes?: any;
  success: boolean;
  errorMessage?: string;
  sessionId?: string;
  requestId?: string;
}

// Sensitive routes that require detailed audit logging
const AUDIT_ROUTES = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/verify-mfa',
  '/api/v1/auth/change-password',
  '/api/v1/mfa/setup',
  '/api/v1/mfa/verify',
  '/api/v1/mfa/disable',
  '/api/v1/medical-records',
  '/api/v1/prescriptions',
  '/api/v1/billings',
];

// Actions that should trigger security alerts
const SECURITY_SENSITIVE_ACTIONS = [
  'login_failed',
  'account_locked',
  'mfa_disabled',
  'password_changed',
  'unauthorized_access',
  'data_export',
  'bulk_delete',
];

/**
 * Check if route requires audit logging
 */
const shouldAudit = (path: string, method: string): boolean => {
  // Audit all POST, PUT, PATCH, DELETE requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true;
  }

  // Audit specific GET routes
  return AUDIT_ROUTES.some(route => path.startsWith(route));
};

/**
 * Extract action from request
 */
const extractAction = (req: Request): string => {
  const { method, path } = req;
  
  if (path.includes('/login')) return 'user_login';
  if (path.includes('/register')) return 'user_register';
  if (path.includes('/verify-mfa')) return 'mfa_verification';
  if (path.includes('/change-password')) return 'password_change';
  if (path.includes('/mfa/setup')) return 'mfa_setup';
  if (path.includes('/mfa/disable')) return 'mfa_disable';
  
  // Default action based on method
  const actions: { [key: string]: string } = {
    'POST': 'create',
    'GET': 'read',
    'PUT': 'update',
    'PATCH': 'partial_update',
    'DELETE': 'delete',
  };
  
  return actions[method] || 'unknown';
};

/**
 * Extract resource from path
 */
const extractResource = (path: string): string => {
  const match = path.match(/\/api\/v\d+\/([^/?]+)/);
  return match ? match[1] : 'unknown';
};

/**
 * Main audit logging middleware
 */
export const auditLogger = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Skip if audit logging is disabled
  if (process.env.AUDIT_LOG_ENABLED !== 'true') {
    return next();
  }

  // Skip non-audited routes
  if (!shouldAudit(req.path, req.method)) {
    return next();
  }

  // Generate request ID
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  (req as any).requestId = requestId;

  // Capture original response methods
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  let responseBody: any;
  let isError = false;

  // Override res.json to capture response
  res.json = function (body: any) {
    responseBody = body;
    isError = !body.success;
    return originalJson(body);
  };

  // Override res.send for non-JSON responses
  res.send = function (body: any) {
    if (!responseBody) {
      responseBody = body;
    }
    return originalSend(body);
  };

  // Log after response is sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    const auditEntry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      userEmail: req.user?.email,
      userRole: req.user?.role,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('user-agent') || 'unknown',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      action: extractAction(req),
      resource: extractResource(req.path),
      success: res.statusCode < 400 && !isError,
      requestId,
      sessionId: req.get('x-session-id'),
    };

    // Add error message if failed
    if (!auditEntry.success && responseBody) {
      auditEntry.errorMessage = responseBody.message || responseBody.error || 'Unknown error';
    }

    // Add changes for update operations
    if (['PUT', 'PATCH', 'POST'].includes(req.method) && req.body) {
      // Sanitize sensitive data
      const sanitizedBody = { ...req.body };
      delete sanitizedBody.password;
      delete sanitizedBody.currentPassword;
      delete sanitizedBody.newPassword;
      delete sanitizedBody.mfaToken;
      
      auditEntry.changes = sanitizedBody;
    }

    // Determine log level based on action
    let logLevel: 'info' | 'warn' | 'error' = 'info';
    
    if (res.statusCode >= 500) {
      logLevel = 'error';
    } else if (res.statusCode >= 400 || SECURITY_SENSITIVE_ACTIONS.includes(auditEntry.action)) {
      logLevel = 'warn';
    }

    // Log the audit entry
    logger[logLevel](`[AUDIT] ${JSON.stringify(auditEntry)}`);

    // Additional security alert for critical events
    if (SECURITY_SENSITIVE_ACTIONS.includes(auditEntry.action) || res.statusCode === 401 || res.statusCode === 403) {
      logger.warn(`[SECURITY_ALERT] ${auditEntry.action} - User: ${auditEntry.userEmail || 'anonymous'} - IP: ${auditEntry.ipAddress} - Status: ${res.statusCode}`);
    }

    // Log performance metrics
    if (duration > 5000) {
      logger.warn(`[PERFORMANCE] Slow request detected: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
};

/**
 * Manual audit log function for programmatic logging
 */
export const logAuditEvent = (
  action: string,
  details: {
    userId?: number;
    userEmail?: string;
    resource?: string;
    success: boolean;
    message?: string;
    metadata?: any;
  }
): void => {
  if (process.env.AUDIT_LOG_ENABLED !== 'true') {
    return;
  }

  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    ...details,
  };

  const logLevel = details.success ? 'info' : 'warn';
  logger[logLevel](`[AUDIT] ${JSON.stringify(auditEntry)}`);
};

/**
 * Export audit logs for compliance reporting
 * This function would typically write to a separate audit database
 */
export const exportAuditLogs = async (
  startDate: Date,
  endDate: Date,
  filters?: {
    userId?: number;
    action?: string;
    resource?: string;
  }
): Promise<any[]> => {
  // In production, query audit database
  // For now, this is a placeholder
  logger.info(`[AUDIT] Exporting audit logs from ${startDate.toISOString()} to ${endDate.toISOString()}`);
  
  return [];
};

export default {
  auditLogger,
  logAuditEvent,
  exportAuditLogs,
};
