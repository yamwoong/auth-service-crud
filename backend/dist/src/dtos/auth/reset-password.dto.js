"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Joi schema to validate reset-password request
 */
exports.resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required().messages({
        'any.required': 'Reset token is required',
        'string.empty': 'Reset token cannot be empty',
    }),
    newPassword: joi_1.default.string().min(6).required().messages({
        'any.required': 'New password is required',
        'string.min': 'Password must be at least 6 characters',
    }),
});
