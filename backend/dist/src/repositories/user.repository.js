"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typedi_1 = require("typedi");
const user_mapper_1 = require("../mappers/user.mapper");
const user_schema_1 = require("../schemas/user.schema");
const mongoose_1 = require("mongoose");
let UserRepository = class UserRepository {
    /**
     * Retrieves all users from the database.
     * Typically used for admin or test purposes.
     * Avoid using in production unless necessary due to potential performance impact.
     */
    async findAll() {
        const users = await user_schema_1.UserModel.find().lean();
        return users.map(user_mapper_1.mapMongoUserToUser);
    }
    /**
     * Creates a new user in the database.
     * Converts the raw MongoDB document into a clean domain model.
     */
    async create(data) {
        const created = await user_schema_1.UserModel.create(data);
        return created.toObject(); // ✅ raw MongoUser 반환
    }
    /**
     * Finds a user by email.
     * Commonly used for login or email duplication checks.
     */
    async findByEmail(email) {
        return await user_schema_1.UserModel.findOne({ email }).select('+password').lean();
    }
    /**
     * Finds a user by username.
     * Used in login or username duplication checks.
     */
    async findByUsername(username) {
        return await user_schema_1.UserModel.findOne({ username }).select('+password').lean();
    }
    /**
     * Finds a user by ID.
     * Used in auth middleware (JWT validation).
     */
    async findById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        return await user_schema_1.UserModel.findById(new mongoose_1.Types.ObjectId(id)).select('+password');
    }
    /**
     * Checks whether a user exists with the given email or username.
     * Used to detect duplicate users during registration.
     * Optimized by selecting only the _id field and using lean() for performance.
     */
    async existsByEmailOrUsername(email, username) {
        const user = await user_schema_1.UserModel.findOne({
            $or: [{ email }, { username }],
        })
            .select('_id')
            .lean();
        return !!user;
    }
    /**
     * Determines which field is causing a conflict.
     * Returns 'email' if the email is already taken,
     * 'username' if the username is already taken,
     * or null if no conflict.
     */
    async findConflictField(email, username) {
        const user = await user_schema_1.UserModel.findOne({
            $or: [{ email }, { username }],
        })
            .select('email username')
            .lean();
        if (!user) {
            return null;
        }
        // If the stored document's email matches, it's an email conflict
        return user.email === email ? 'email' : 'username';
    }
    /**
     * Updates a user's password.
     * This operation is used in password change and reset flows.
     * Only updates the password field.
     *
     * @param userId - The user's MongoDB ID
     * @param hashedPassword - The new password hash to store
     */
    async updatePassword(userId, hashedPassword) {
        await user_schema_1.UserModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: false, lean: true });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, typedi_1.Service)()
], UserRepository);
