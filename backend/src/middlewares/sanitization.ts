import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

/**
 * Input Sanitization Middleware
 * ISO 27001 A.14.2.1 - Secure development policy
 * Prevents XSS, SQL injection, and other injection attacks
 */

const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    // Remove HTML tags and dangerous characters
    return validator.escape(value.trim());
  }
  
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  
  if (typeof value === 'object' && value !== null) {
    const sanitized: any = {};
    for (const key in value) {
      sanitized[key] = sanitizeValue(value[key]);
    }
    return sanitized;
  }
  
  return value;
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  
  next();
};

export default sanitizeInput;
