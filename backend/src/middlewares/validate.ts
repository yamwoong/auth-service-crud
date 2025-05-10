import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { AppError } from '@errors/AppError';
import { COMMON_ERRORS } from '@constants/errors';

/**
 * Request validation middleware based on Joi schema.
 *
 * @param schema Joi schema object (e.g., loginSchema)
 * @param property The part of the request to validate ('body' | 'query' | 'params')
 */

export const validate =
  (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      throw new AppError(COMMON_ERRORS.VALIDATION_FAILED, 400);
    }

    next();
  };
