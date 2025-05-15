"use strict";
// src/services/user.service.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typedi_1 = require("typedi");
const user_repository_1 = require("../repositories/user.repository");
const UserAlreadyExistsError_1 = require("../errors/UserAlreadyExistsError");
const hash_1 = require("@utils/hash");
const errors_1 = require("@constants/errors");
const AppError_1 = require("@errors/AppError");
const hash_2 = require("@utils/hash");
const user_mapper_1 = require("@mappers/user.mapper");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Retrieve all users.
     * Primarily used for administrative or debugging purposes.
     */
    async findAllUsers() {
        return this.userRepository.findAll();
    }
    /**
     * Create a new user after verifying uniqueness and hashing the password.
     * @param data - The user's registration input.
     * @returns The created user without exposing the password.
     * @throws UserAlreadyExistsError if either email or username is already in use.
     */
    async createUser(data) {
        const conflict = await this.userRepository.findConflictField(data.email, data.username);
        if (conflict) {
            const identifier = conflict === 'email' ? data.email : data.username;
            throw new UserAlreadyExistsError_1.UserAlreadyExistsError(identifier);
        }
        const hashed = await (0, hash_1.hashPassword)(data.password);
        // 1️⃣ raw MongoUser 받기
        const created = await this.userRepository.create({ ...data, password: hashed });
        // 2️⃣ 매핑 후 반환
        return (0, user_mapper_1.mapMongoUserToUser)(created);
    }
    /**
     * Updates a user's password after verifying the current password.
     *
     * @param userId - The ID of the authenticated user
     * @param currentPassword - The user's current password for verification
     * @param newPassword - The new password to be hashed and saved
     * @throws UserNotFoundError - If no user exists with the given ID
     * @throws InvalidPasswordError - If the current password is incorrect
     */
    async updatePassword(userid, currentPassword, newPassword) {
        const user = await this.getUserByIdOrThrow(userid);
        const isMatch = await (0, hash_2.comparePassword)(currentPassword, user.password);
        if (!isMatch) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.INVALID_CURRENT_PASSWORD, 401);
        }
        const hashed = await (0, hash_1.hashPassword)(newPassword);
        await this.userRepository.updatePassword(userid, hashed);
    }
    /**
     * Retrieves a user by ID or throws a 404 error if not found.
     *
     * @param userId - MongoDB ObjectId of the user
     * @returns The user document
     * @throws AppError with 404 if user does not exist
     */
    async getUserByIdOrThrow(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.AppError(errors_1.AUTH_ERRORS.USER_NOT_FOUND, 404);
        }
        return user;
    }
    /**
     * Find an existing user by Google email, or create a new user if not exists.
     *
     * @param email - The user's Google email address
     * @param name - The user's full name from Google profile
     * @param googleId - The Google-provided unique ID
     * @returns The found or newly created user
     */
    async findOrCreateGoogleUser(email, name, googleId) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            return (0, user_mapper_1.mapMongoGoogleUserToUser)(existingUser); // ✅ 소셜 유저용 매퍼 사용
        }
        const username = email.split('@')[0];
        const socialUser = {
            email,
            name,
            username,
            provider: 'google',
            googleId,
            password: '',
        };
        const created = await this.userRepository.create(socialUser);
        return (0, user_mapper_1.mapMongoGoogleUserToUser)(created); // ✅ 동일하게 적용
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
