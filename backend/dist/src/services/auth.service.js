"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const typedi_1 = require("typedi");
const user_repository_1 = require("@repositories/user.repository");
const refreshToken_repository_1 = require("@repositories/refreshToken.repository");
const hash_1 = require("@utils/hash");
const jwt_1 = require("@utils/jwt");
const AppError_1 = require("@errors/AppError");
const errors_1 = require("@constants/errors");
const user_mapper_1 = require("@mappers/user.mapper");
const refresh_token_schema_1 = require("@schemas/refresh-token.schema");
const user_service_1 = require("@services/user.service");
const mail_1 = require("@utils/mail");
const env_1 = require("@config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let AuthService = class AuthService {
    constructor(userRepository, refreshTokenRepo) {
        this.userRepository = userRepository;
        this.refreshTokenRepo = refreshTokenRepo;
    }
    /**
     * Log in a user, issue access & refresh tokens,
     * store the refresh token in DB, and return both tokens + user data.
     */
    async login(dto) {
        const { email, username, password } = dto;
        const userEntity = await this.getUserOrThrow(email, username);
        await (0, hash_1.verifyPasswordOrThrow)(password, userEntity.password);
        const userId = userEntity._id.toString();
        const accessToken = (0, jwt_1.signAuthToken)(userId);
        const refreshToken = (0, jwt_1.signRefreshToken)(userId);
        await refresh_token_schema_1.RefreshTokenModel.create({
            userId: userId,
            token: refreshToken,
        });
        const user = (0, user_mapper_1.mapMongoUserToUser)(userEntity); // safe response
        return { token: accessToken, refreshToken, user };
    }
    /**
     * Validates a refresh token, rotates it, and issues a new access + refresh token.
     */
    async refreshToken(token) {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const userId = payload.userId;
        const existing = await refresh_token_schema_1.RefreshTokenModel.findOne({ token });
        if (!existing) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.INVALID_CREDENTIALS, 401);
        }
        await existing.deleteOne();
        const userService = typedi_1.Container.get(user_service_1.UserService);
        const user = await userService.getUserByIdOrThrow(userId);
        const accessToken = (0, jwt_1.signAuthToken)(user._id.toString());
        const newRefreshToken = (0, jwt_1.signRefreshToken)(user._id.toString());
        await refresh_token_schema_1.RefreshTokenModel.create({ userId: user._id.toString(), token: newRefreshToken });
        return { accessToken, refreshToken: newRefreshToken };
    }
    /**
     * Finds a user by email or username.
     * Throws AppError(401) if user not found.
     */
    async getUserOrThrow(email, username) {
        const user = email != null
            ? await this.userRepository.findByEmail(email)
            : await this.userRepository.findByUsername(username);
        if (!user) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.INVALID_CREDENTIALS, 401);
        }
        return user;
    }
    /**
     * Handles user logout by revoking the provided refresh token.
     * @param refreshToken - the token to revoke
     * @throws AppError(400) if no token provided
     * @throws AppError(401) if token invalid or already revoked
     */
    async logout(refreshToken) {
        if (!refreshToken) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.NO_REFRESH_TOKEN_PROVIDED, 400);
        }
        const deleted = await this.refreshTokenRepo.deleteByToken(refreshToken);
        if (!deleted) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.INVALID_CREDENTIALS, 401);
        }
    }
    /**
     * Sends a reset password email to the user's registered email address.
     * @param username The username to look up the user
     */
    async sendResetPasswordLink(username) {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.USER_NOT_FOUND, 404);
        }
        const token = (0, jwt_1.signAuthToken)(user._id.toString(), '10m');
        const resetUrl = `${env_1.env.resetPasswordUrl}?token=${token}`;
        await (0, mail_1.sendResetPasswordEmail)(user.email, resetUrl);
    }
    /**
     * Resets the user's password using a valid JWT reset token.
     * @param token - The JWT reset token sent to the user's email
     * @param newPassword - The new password to be hashed and saved
     */
    async resetPassword(token, newPassword) {
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        }
        catch (err) {
            throw new AppError_1.AppError(errors_1.COMMON_ERRORS.INVALID_OR_EXPIRED_TOKEN, 401);
        }
        if (payload.type && payload.type !== 'reset') {
            throw new AppError_1.AppError(errors_1.COMMON_ERRORS.INVALID_OR_EXPIRED_TOKEN, 401);
        }
        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.USER_NOT_FOUND, 404);
        }
        user.password = await (0, hash_1.hashPassword)(newPassword);
        await this.userRepository.updatePassword(payload.userId, user.password);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, typedi_1.Service)(),
    __param(1, (0, typedi_1.Inject)()),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        refreshToken_repository_1.RefreshTokenRepository])
], AuthService);
