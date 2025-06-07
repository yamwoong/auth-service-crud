/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSocialUserDto = {
    email: string;
    name: string;
    username: string;
    provider: CreateSocialUserDto.provider;
    googleId: string;
};
export namespace CreateSocialUserDto {
    export enum provider {
        GOOGLE = 'google',
    }
}

