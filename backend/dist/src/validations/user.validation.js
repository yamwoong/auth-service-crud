"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).required().messages({
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
    }),
    email: joi_1.default.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address',
    }),
    name: joi_1.default.string().required().messages({
        'any.required': 'Name is required',
    }),
    password: joi_1.default.string().min(6).required().messages({
        'any.required': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
    }),
});
exports.updatePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().min(6).required().messages({
        'any.required': 'Current password is required',
        'string.min': 'Current password must be at least 6 characters',
    }),
    newPassword: joi_1.default.string().min(6).required().messages({
        'any.required': 'New password is required',
        'string.min': 'New password must be at least 6 characters',
    }),
});
