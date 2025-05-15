"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("@controllers/user.controller");
const auth_controller_1 = require("@controllers/auth.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
const validate_1 = require("@middlewares/validate");
const user_validation_1 = require("@validations/user.validation");
const router = (0, express_1.Router)();
// GET /users
router.get('/', user_controller_1.getAllUsers);
// POST /users
router.post('/', user_controller_1.createUser);
// PATCH /users/me/password
router.patch('/me/password', auth_middleware_1.authMiddleware, (0, validate_1.validate)(user_validation_1.updatePasswordSchema), auth_controller_1.updatePassword);
exports.default = router;
