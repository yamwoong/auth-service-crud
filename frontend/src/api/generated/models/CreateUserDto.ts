/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUserDto = {
    /**
     * User-defined login ID
     */
    username: string;
    /**
     * Unique email address
     */
    email: string;
    name: string;
    /**
     * Signup provider. If 'local', password is required. If 'google', password must NOT be present.
     */
    provider?: CreateUserDto.provider;
    /**
     * Required if provider is 'local'. Forbidden if provider is 'google'.
     */
    password?: string | null;
    /**
     * Google unique user ID (required if provider is 'google')
     */
    googleId?: string;
};
export namespace CreateUserDto {
    /**
     * Signup provider. If 'local', password is required. If 'google', password must NOT be present.
     */
    export enum provider {
        LOCAL = 'local',
        GOOGLE = 'google',
    }
}

