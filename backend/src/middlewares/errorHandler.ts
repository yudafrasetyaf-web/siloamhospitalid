import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Convert known errors to AppError
  if (err.name === 'ValidationError') {
    error = new AppError('Validation Error', 400);
  } else if (err.name === 'CastError') {
    error = new AppError('Invalid ID format', 400);
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    error = new AppError('Duplicate field value entered', 400);
  } else if (err.name === 'SequelizeValidationError') {
    error = new AppError('Validation failed', 400);
  }

  // Send error response
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    });
  } else {
    // Programming or unknown errors
    res.status(500).json({
      success: false,
      error: {
        message: process.env.NODE_ENV === 'development' 
          ? err.message 
          : 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
