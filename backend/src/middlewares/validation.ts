import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: any[] = [];
    errors.array().forEach(err => {
      if (err.type === 'field') {
        extractedErrors.push({ 
          field: err.path, 
          message: err.msg 
        });
      }
    });

    throw new AppError(JSON.stringify(extractedErrors), 422);
  };
};
