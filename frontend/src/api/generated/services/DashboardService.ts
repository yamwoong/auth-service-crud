/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DashboardResponse } from '../models/DashboardResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DashboardService {
    /**
     * Retrieve authenticated user's dashboard
     * @returns DashboardResponse Dashboard data returned
     * @throws ApiError
     */
    public static getDashboard(): CancelablePromise<DashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard',
            errors: {
                401: `Unauthorized — authentication required`,
            },
        });
    }
}
