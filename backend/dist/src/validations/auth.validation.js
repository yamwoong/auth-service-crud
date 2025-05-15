"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Login validation schema
 * - Requires either email or username
 * - Password must be at least 6 characters
 */
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email(),
    username: joi_1.default.string().alphanum().min(3),
    password: joi_1.default.string().min(6).required(),
})
    .or('email', 'username')
    .messages({
    'object.missing': 'Either email or username is required',
    'string.email': 'Email must be a valid email address',
    'string.min': '{#label} must be at least {#limit} characters',
    'any.required': '{#label} is required',
});
