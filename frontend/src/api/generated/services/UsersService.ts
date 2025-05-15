/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { ResponseMessage } from '../models/ResponseMessage';
import type { UpdatePasswordDto } from '../models/UpdatePasswordDto';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Retrieve all users
     * @returns User List of users
     * @throws ApiError
     */
    public static getUsers(): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
        });
    }
    /**
     * Register a new user
     * @param requestBody
     * @returns User Created — returns the new user
     * @throws ApiError
     */
    public static postUsers(
        requestBody: CreateUserDto,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict — email or username already exists`,
            },
        });
    }
    /**
     * Retrieve a single user by ID
     * @param id Unique identifier of the user
     * @returns User User object
     * @throws ApiError
     */
    public static getUsers1(
        id: string,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Update the authenticated user's password
     * @param requestBody
     * @returns ResponseMessage Password updated successfully
     * @throws ApiError
     */
    public static patchUsersMePassword(
        requestBody: UpdatePasswordDto,
    ): CancelablePromise<ResponseMessage> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/me/password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request — invalid input`,
                401: `Unauthorized — authentication required`,
            },
        });
    }
}
