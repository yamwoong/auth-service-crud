"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleUserInfo = exports.getGoogleTokens = exports.buildGoogleOAuthURL = void 0;
const querystring_1 = __importDefault(require("querystring"));
const axios_1 = __importDefault(require("axios"));
const env_1 = require("@config/env");
/**
 * Generate Google OAuth2 authorization URL
 *
 * @returns {string} - URL to redirect user to Google OAuth2 login
 * @usage Used in GET /auth/google to redirect users to the Google login page
 */
const buildGoogleOAuthURL = () => {
    const clientId = env_1.env.googleClientId;
    const redirectUri = env_1.env.googleCallbackUrl;
    const scope = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ');
    const params = querystring_1.default.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope,
        access_type: 'offline',
        prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};
exports.buildGoogleOAuthURL = buildGoogleOAuthURL;
/**
 * Exchange authorization code for access token from Google
 *
 * @param code Authorization code received from Google
 * @returns {Promise<{ access_token: string, ... }>} Access token and other token info
 * @usage Called in GET /auth/google/callback to exchange code for access_token
 */
const getGoogleTokens = async (code) => {
    const response = await axios_1.default.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: env_1.env.googleClientId,
        client_secret: env_1.env.googleClientSecret,
        redirect_uri: env_1.env.googleCallbackUrl,
        grant_type: 'authorization_code',
    }, { headers: { 'Content-Type': 'application/json' } });
    return response.data;
};
exports.getGoogleTokens = getGoogleTokens;
/**
 * Fetch user's profile information from Google using access_token
 *
 * @param accessToken Access token obtained from Google
 * @returns {Promise<{ email: string, name: string, id: string }>} Basic user info
 * @usage Called in GET /auth/google/callback after receiving access_token
 */
const getGoogleUserInfo = async (accessToken) => {
    const response = await axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
};
exports.getGoogleUserInfo = getGoogleUserInfo;
