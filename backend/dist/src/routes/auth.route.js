"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("@middlewares/auth.middleware");
const auth_controller_1 = require("@controllers/auth.controller");
const router = (0, express_1.Router)();
// Login endpoint
router.post('/login', auth_controller_1.login);
// Refresh access token using the refresh token
router.post('/refresh', auth_controller_1.refresh);
router.post('/logout', auth_middleware_1.authMiddleware, auth_controller_1.logout);
router.get('/google', auth_controller_1.googleAuthRedirect);
router.get('/google/callback', auth_controller_1.googleAuthCallback);
router.post('/forgot-password', auth_controller_1.forgotPassword);
router.post('/reset-password', auth_controller_1.resetPassword);
exports.default = router;
