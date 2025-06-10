"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const env_1 = require("@config/env");
const AppError_1 = require("@errors/AppError");
const errors_1 = require("@constants/errors");
const user_repository_1 = require("@repositories/user.repository");
const typedi_1 = require("typedi");
const user_mapper_1 = require("@mappers/user.mapper");
/**
 * Middleware to authenticate requests using JWT.
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.UNAUTHORIZED, 401);
        }
        const token = authHeader.slice(7).trim();
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new AppError_1.AppError(errors_1.AUTH_ERRORS.UNAUTHORIZED, 401);
            }
            throw err;
        }
        const repo = typedi_1.Container.get(user_repository_1.UserRepository);
        const mongoUser = await repo.findById(payload.userId);
        if (!mongoUser) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.UNAUTHORIZED, 401);
        }
        req.user = (0, user_mapper_1.mapMongoUserToUser)(mongoUser);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authMiddleware = authMiddleware;
