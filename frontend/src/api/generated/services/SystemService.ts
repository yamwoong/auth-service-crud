/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemService {
    /**
     * Health check
     * @returns string pong
     * @throws ApiError
     */
    public static getPing(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ping',
        });
    }
}
