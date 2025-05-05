import { Request, Response, NextFunction } from 'express';
import { AppError } from '@errors/AppError';

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    console.error('Unexpected error:', err);

    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
}
