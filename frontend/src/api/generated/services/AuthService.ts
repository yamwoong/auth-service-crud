/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForgotPasswordDto } from '../models/ForgotPasswordDto';
import type { LoginDto } from '../models/LoginDto';
import type { LoginResponse } from '../models/LoginResponse';
import type { RefreshTokenResponse } from '../models/RefreshTokenResponse';
import type { ResetPasswordDto } from '../models/ResetPasswordDto';
import type { ResponseMessage } from '../models/ResponseMessage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * User login
     * @param requestBody
     * @returns LoginResponse Login successful — returns JWT and user info
     * @throws ApiError
     */
    public static postAuthLogin(
        requestBody: LoginDto,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request — missing required fields`,
                401: `Unauthorized — invalid credentials`,
            },
        });
    }
    /**
     * Refresh access token using refresh token
     * @returns RefreshTokenResponse New access token issued
     * @throws ApiError
     */
    public static postAuthRefresh(): CancelablePromise<RefreshTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            errors: {
                401: `Unauthorized — invalid or missing refresh token`,
            },
        });
    }
    /**
     * Log out the user and clear refresh token
     * @returns ResponseMessage Logged out successfully
     * @throws ApiError
     */
    public static postAuthLogout(): CancelablePromise<ResponseMessage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                401: `Unauthorized — authentication required`,
            },
        });
    }
    /**
     * Redirect to Google OAuth2 login
     * @returns void
     * @throws ApiError
     */
    public static getAuthGoogle(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google',
            errors: {
                302: `Redirect to Google OAuth2 authentication URL`,
            },
        });
    }
    /**
     * Handle Google OAuth2 callback
     * @param code Authorization code returned by Google
     * @returns LoginResponse Login via Google successful
     * @throws ApiError
     */
    public static getAuthGoogleCallback(
        code?: string,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google/callback',
            query: {
                'code': code,
            },
            errors: {
                400: `Bad Request — authorization code not provided`,
            },
        });
    }
    /**
     * Send password reset email
     * @param requestBody
     * @returns ResponseMessage Password reset email sent
     * @throws ApiError
     */
    public static postAuthForgotPassword(
        requestBody: ForgotPasswordDto,
    ): CancelablePromise<ResponseMessage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request — missing or invalid fields`,
            },
        });
    }
    /**
     * Reset user's password using token
     * @param requestBody
     * @returns ResponseMessage Password has been reset successfully
     * @throws ApiError
     */
    public static postAuthResetPassword(
        requestBody: ResetPasswordDto,
    ): CancelablePromise<ResponseMessage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request — invalid token or fields`,
            },
        });
    }
}
