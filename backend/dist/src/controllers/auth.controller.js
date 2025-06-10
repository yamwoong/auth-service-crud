"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.googleAuthCallback = exports.googleAuthRedirect = exports.logout = exports.updatePassword = exports.refresh = exports.login = void 0;
const typedi_1 = require("typedi");
const auth_service_1 = require("@services/auth.service");
const auth_validation_1 = require("@validations/auth.validation");
const asyncHandler_1 = require("@utils/asyncHandler");
const cookies_1 = require("@utils/cookies");
const user_validation_1 = require("@validations/user.validation");
const user_service_1 = require("@services/user.service");
const google_1 = require("@utils/google");
const google_2 = require("@utils/google");
const jwt_1 = require("@utils/jwt");
const forgot_password_dto_1 = require("@dtos/auth/forgot-password.dto");
const reset_password_dto_1 = require("@dtos/auth/reset-password.dto");
const refreshToken_repository_1 = require("@repositories/refreshToken.repository");
/**
 * @route   POST /auth/login
 * @desc    Login a user and return JWT token
 * @access  Public
 */
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const dto = await auth_validation_1.loginSchema.validateAsync(req.body, {
        abortEarly: false,
    });
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    const { token, refreshToken, user } = await authService.login(dto);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ token, user });
});
/**
 * @route   POST /auth/refresh
 * @desc    Validate Refresh Token and issue new Access & Refresh tokens
 * @access  Public
 */
exports.refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = (0, cookies_1.getRefreshTokenFromCookie)(req);
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    const { accessToken, refreshToken: newRefresh } = await authService.refreshToken(existing);
    (0, cookies_1.setRefreshTokenCookie)(res, newRefresh);
    res.status(200).json({ accessToken });
});
/**
 * @route   PATCH /users/me/password
 * @desc    Update user's password after verifying current password
 * @access  Private
 */
exports.updatePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const dto = await user_validation_1.updatePasswordSchema.validateAsync(req.body, {
        abortEarly: false,
    });
    const userService = typedi_1.Container.get(user_service_1.UserService);
    await userService.updatePassword(user.id, dto.currentPassword, dto.newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
});
/**
 * @route   POST /auth/logout
 * @desc    Revoke refresh token and clear cookie
 * @access  Private
 */
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = (0, cookies_1.getRefreshTokenFromCookie)(req);
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    await authService.logout(refreshToken);
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
/**
 *
 * @route GET /auth/google
 * @desc Redirects user to Google OAuth2 login page
 * @access Public
 *
 */
const googleAuthRedirect = (req, res) => {
    const googleAuthUrl = (0, google_1.buildGoogleOAuthURL)();
    return res.redirect(googleAuthUrl);
};
exports.googleAuthRedirect = googleAuthRedirect;
/**
 * @route   GET /auth/google/callback
 * @desc    Handle Google OAuth2 callback and log in the user
 * @access  Public
 */
exports.googleAuthCallback = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.status(400).json({ message: 'Authorization code not provided' });
        return;
    }
    const { access_token } = await (0, google_2.getGoogleTokens)(code);
    const { email, name, id: googleId } = await (0, google_2.getGoogleUserInfo)(access_token);
    const userService = typedi_1.Container.get(user_service_1.UserService);
    const user = await userService.findOrCreateGoogleUser(email, name, googleId);
    const accessToken = (0, jwt_1.signAuthToken)(user.id);
    const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
    const refreshTokenRepo = typedi_1.Container.get(refreshToken_repository_1.RefreshTokenRepository);
    await refreshTokenRepo.saveToken(user.id, refreshToken);
    (0, cookies_1.setRefreshTokenCookie)(res, refreshToken);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/oauth-success?token=${accessToken}&userId=${user.id}`);
});
/**
 * @route   POST /auth/forgot-password
 * @desc    Send password reset email for the given username
 * @access  Public
 */
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { username } = await forgot_password_dto_1.forgotPasswordSchema.validateAsync(req.body, {
        abortEarly: false,
    });
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    await authService.sendResetPasswordLink(username);
    res.status(200).json({
        message: 'If an account with that username exists, a password reset email has been sent.',
    });
});
/**
 * @route   POST /auth/reset-password
 * @desc    Reset user's password using JWT token
 * @access  Public
 */
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token, newPassword } = await reset_password_dto_1.resetPasswordSchema.validateAsync(req.body, {
        abortEarly: false,
    });
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password has been reset successfully.' });
});
