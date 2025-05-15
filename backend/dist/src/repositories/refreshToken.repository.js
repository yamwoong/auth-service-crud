"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepository = void 0;
const typedi_1 = require("typedi");
const refresh_token_schema_1 = require("@schemas/refresh-token.schema");
let RefreshTokenRepository = class RefreshTokenRepository {
    /**
     * Stores a new refresh token for the given user.
     * @param userId – The ID of the user
     * @param token – The refresh token string
     * @usage Called after login (including Google OAuth)
     */
    async saveToken(userId, token) {
        await refresh_token_schema_1.RefreshTokenModel.create({ userId, token });
    }
    /**
     * Deletes a refresh token by its token string.
     * @param token – the refresh token to delete
     * @returns true if a record was deleted, false otherwise
     *
     */
    async deleteByToken(token) {
        const result = await refresh_token_schema_1.RefreshTokenModel.deleteOne({ token });
        return (result.deletedCount ?? 0) > 0;
    }
    /**
     * Deletes all refresh tokens for a given user ID.
     * @param userId – the user ID whose tokens to delete
     * @returns the number of tokens deleted
     *
     */
    async deleteByUserId(userId) {
        const result = await refresh_token_schema_1.RefreshTokenModel.deleteMany({ userId });
        return result.deletedCount ?? 0;
    }
};
exports.RefreshTokenRepository = RefreshTokenRepository;
exports.RefreshTokenRepository = RefreshTokenRepository = __decorate([
    (0, typedi_1.Service)()
], RefreshTokenRepository);
