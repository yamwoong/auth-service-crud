/**
 * AppError is the base class for all custom application errors.
 * It extends the built-in Error and carries an HTTP status code.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Clean stack trace: skip constructor
    Error.captureStackTrace(this, this.constructor);
  }
}
