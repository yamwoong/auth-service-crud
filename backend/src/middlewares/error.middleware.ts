import { Request, Response, NextFunction } from 'express';
import { AppError } from '@errors/AppError';
import { ValidationError } from 'joi';

/**
 * Global error handler middleware.
 * - Handles AppError with its statusCode and message.
 * - Logs and returns a 500 Internal Server Error for unexpected errors.
 */
export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (res.headersSent) {
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      details: err.details.map((detail) => detail.message),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
