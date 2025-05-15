"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.createUser = void 0;
const typedi_1 = require("typedi");
const user_service_1 = require("../services/user.service");
const user_validation_1 = require("@validations/user.validation");
const asyncHandler_1 = require("@utils/asyncHandler");
const userService = typedi_1.Container.get(user_service_1.UserService);
/**
@route   POST /users
@desc    Create a new user (with Joi validation)
@access  Public
 */
exports.createUser = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const validated = await user_validation_1.createUserSchema.validateAsync(req.body, { abortEarly: false });
    const userData = validated;
    const createdUser = await userService.createUser(userData);
    res.status(201).json(createdUser);
});
/**
@route   GET /users
@desc    Get all users
@access  Public
*/
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const users = await userService.findAllUsers();
    res.status(200).json(users);
});
