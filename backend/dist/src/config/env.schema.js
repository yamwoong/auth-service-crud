"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Define and validate application environment variables.
 */
exports.envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid('development', 'production', 'test')
        .required()
        .description('Node.js environment (development, production, test)'), // Execution mode of the application
    PORT: joi_1.default.number().port().required().description('Server listening port'), // Port number on which the server listens
    MONGODB_URI: joi_1.default.string().uri().required().description('MongoDB connection URI'), // Connection URI for MongoDB
    JWT_SECRET: joi_1.default.string().min(32).required().description('JWT secret key (minimum 32 characters)'), // Secret key for signing JWTs (at least 32 characters)
    REDIS_URL: joi_1.default.string().uri().optional().allow('').description('Redis URL (optional)'), // Connection URL for Redis (optional)
    GOOGLE_CLIENT_ID: joi_1.default.string().required().description('Google OAuth Client ID'),
    GOOGLE_CLIENT_SECRET: joi_1.default.string().required().description('Google OAuth Client Secret'),
    GOOGLE_CALLBACK_URL: joi_1.default.string().uri().required().description('Google OAuth Redirect URI'),
    GMAIL_CLIENT_ID: joi_1.default.string().required().description('Gmail OAuth2 Client ID for sending emails'),
    GMAIL_CLIENT_SECRET: joi_1.default.string()
        .required()
        .description('Gmail OAuth2 Client Secret for sending emails'),
    GMAIL_REFRESH_TOKEN: joi_1.default.string()
        .required()
        .description('Gmail OAuth2 Refresh Token for SMTP access'),
    GMAIL_USER: joi_1.default.string().email().required().description('Gmail account used to send emails'),
    RESET_PASSWORD_URL: joi_1.default.string()
        .uri()
        .required()
        .description('Frontend URL for password reset form'),
})
    .unknown(true) // Ignore environment variables not defined in this schema
    .required(); // Require the presence of this entire schema object
