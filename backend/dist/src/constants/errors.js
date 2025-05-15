"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_ERRORS = exports.AUTH_ERRORS = void 0;
exports.AUTH_ERRORS = {
    INVALID_CREDENTIALS: 'Invalid credentials',
    UNAUTHORIZED: 'Unauthorized access',
    USER_NOT_FOUND: 'User not found',
    INVALID_CURRENT_PASSWORD: 'Current password is incorrect',
    NO_REFRESH_TOKEN_PROVIDED: 'No refresh token provided',
    INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
};
exports.COMMON_ERRORS = {
    VALIDATION_FAILED: 'Validation failed',
    INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
};
