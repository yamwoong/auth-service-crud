"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const AppError_1 = require("@errors/AppError");
const joi_1 = require("joi");
/**
 * Global error handler middleware.
 * - Handles AppError with its statusCode and message.
 * - Logs and returns a 500 Internal Server Error for unexpected errors.
 */
const errorMiddleware = (err, _req, res, _next) => {
    if (err instanceof joi_1.ValidationError) {
        res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            details: err.details.map((detail) => detail.message),
        });
        return;
    }
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
        return;
    }
    console.error('Unexpected error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
exports.errorMiddleware = errorMiddleware;
