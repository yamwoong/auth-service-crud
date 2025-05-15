"use strict";
/**
 * AppError is the base class for all custom application errors.
 * It extends the built-in Error and carries an HTTP status code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Clean stack trace: skip constructor
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
