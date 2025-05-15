"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshTokenFromCookie = getRefreshTokenFromCookie;
exports.setRefreshTokenCookie = setRefreshTokenCookie;
const AppError_1 = require("@errors/AppError");
const COOKIE_NAME = 'refreshToken';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN_MS) || 7 * 24 * 60 * 60 * 1000,
};
function getRefreshTokenFromCookie(req) {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token)
        throw new AppError_1.AppError('Refresh token missing', 401);
    return token;
}
function setRefreshTokenCookie(res, token) {
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
}
