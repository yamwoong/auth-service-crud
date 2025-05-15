"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Joi schema to validate forgot-password input.
 */
exports.forgotPasswordSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).required().messages({
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
    }),
});
