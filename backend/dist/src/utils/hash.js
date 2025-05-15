"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.verifyPasswordOrThrow = verifyPasswordOrThrow;
const argon2_1 = __importDefault(require("argon2"));
const AppError_1 = require("@errors/AppError");
const errors_1 = require("@constants/errors");
/**
 * Hashes a user's plaintext password using argon2.
 * @param plainPassword The plaintext password to hash
 * @returns A hashed password string
 */
async function hashPassword(plainPassword) {
    return await argon2_1.default.hash(plainPassword);
}
/**
 * Compares a plaintext password with a hashed password.
 * @param plainPassword The plaintext password to compare
 * @param hashedPassword The previously hashed password
 * @returns A boolean indicating whether the passwords match
 */
async function comparePassword(plainPassword, hashedPassword) {
    return await argon2_1.default.verify(hashedPassword, plainPassword);
}
/**
 * Compares a password and throws if not matched.
 * Useful in services like AuthService.
 */
async function verifyPasswordOrThrow(inputPassword, hashedPassword) {
    const isMatch = await comparePassword(inputPassword, hashedPassword);
    if (!isMatch) {
        throw new AppError_1.AppError(errors_1.AUTH_ERRORS.INVALID_CREDENTIALS, 401);
    }
}
