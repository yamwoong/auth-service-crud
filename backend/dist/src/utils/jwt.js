"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAuthToken = signAuthToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@config/env");
/**
 * Signs a JWT access token with the user's ID.
 * @param userId MongoDB _id string
 * @returns Signed JWT access token string
 */
function signAuthToken(userId, expiresIn = env_1.env.jwtExpiresIn) {
    return jsonwebtoken_1.default.sign({ userId }, env_1.env.jwtSecret, { expiresIn });
}
/**
 * Signs a JWT refresh token with the user's ID.
 * @param userId MongoDB _id string
 * @returns Signed JWT refresh token string
 */
function signRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, env_1.env.refreshSecret, {
        expiresIn: env_1.env.refreshExpiresIn,
    });
}
/**
 * Verifies a refresh token and extracts the payload.
 * @param token Refresh token string
 * @returns Decoded payload containing userId
 * @throws jwt.JsonWebTokenError if token is invalid
 */
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.refreshSecret);
}
