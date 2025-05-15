"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAlreadyExistsError = void 0;
const AppError_1 = require("./AppError");
/**
 * Thrown when attempting to register a user with an existing email or username.
 * Returns HTTP 409 Conflict.
 */
class UserAlreadyExistsError extends AppError_1.AppError {
    constructor(identifier) {
        super(`User with identifier '${identifier}' already exists`, 409);
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
