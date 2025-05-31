/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePostDto } from '../models/CreatePostDto';
import type { Post } from '../models/Post';
import type { UpdatePostDto } from '../models/UpdatePostDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PostsService {
    /**
     * Get all posts
     * @returns Post OK
     * @throws ApiError
     */
    public static getPosts(): CancelablePromise<Array<Post>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/posts',
        });
    }
    /**
     * Create a new post
     * @param requestBody
     * @returns Post Created — returns new post object
     * @throws ApiError
     */
    public static postPosts(
        requestBody: CreatePostDto,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/posts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request — validation failed`,
                401: `Unauthorized — authentication required`,
            },
        });
    }
    /**
     * Get single post by ID
     * @param id Unique identifier of the post
     * @returns Post Post object
     * @throws ApiError
     */
    public static getPosts1(
        id: string,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/posts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found — post does not exist`,
            },
        });
    }
    /**
     * Update post by ID
     * @param id Unique identifier of the post
     * @param requestBody
     * @returns Post Updated — returns updated post
     * @throws ApiError
     */
    public static patchPosts(
        id: string,
        requestBody: UpdatePostDto,
    ): CancelablePromise<Post> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/posts/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request — validation failed`,
                401: `Unauthorized — authentication required`,
                404: `Not Found — post does not exist`,
            },
        });
    }
    /**
     * Delete post by ID
     * @param id Unique identifier of the post
     * @returns void
     * @throws ApiError
     */
    public static deletePosts(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/posts/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized — authentication required`,
                404: `Not Found — post does not exist`,
            },
        });
    }
}
