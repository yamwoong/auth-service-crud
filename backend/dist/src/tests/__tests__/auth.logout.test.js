"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const user_schema_1 = require("@schemas/user.schema");
const hash_1 = require("@utils/hash");
const createDummyUserWithHashedPassword_1 = require("@test-utils/createDummyUserWithHashedPassword");
describe('POST /auth/logout', () => {
    it('should successfully logout with valid tokens', async () => {
        const dto = await (0, createDummyUserWithHashedPassword_1.createDummyUserWithHashedPassword)();
        const hashed = await (0, hash_1.hashPassword)(dto.password);
        await user_schema_1.UserModel.create({
            username: dto.username,
            email: dto.email,
            name: dto.name,
            password: hashed,
        });
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: dto.email, password: dto.password })
            .expect(200);
        const rawCookies = loginRes.headers['set-cookie'];
        if (!rawCookies)
            throw new Error('set-cookie header is missing');
        const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
        const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
        if (!refreshCookie)
            throw new Error('refreshToken cookie is missing');
        const refreshTokenValue = refreshCookie.split(';')[0].split('=')[1];
        const accessToken = loginRes.body.token;
        const logoutRes = await (0, supertest_1.default)(app_1.default)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshTokenValue}`)
            .expect(200);
        const rawLogoutCookies = logoutRes.headers['set-cookie'];
        if (!rawLogoutCookies)
            throw new Error('set-cookie header is missing');
        const logoutCookies = Array.isArray(rawLogoutCookies) ? rawLogoutCookies : [rawLogoutCookies];
        expect(logoutCookies.some((c) => c.startsWith('refreshToken=;'))).toBe(true);
        expect(logoutRes.body).toEqual({ message: 'Logged out successfully' });
    });
    it('should return 401 when reusing a revoked token', async () => {
        const dto = await (0, createDummyUserWithHashedPassword_1.createDummyUserWithHashedPassword)();
        const hashed = await (0, hash_1.hashPassword)(dto.password);
        await user_schema_1.UserModel.create({
            username: dto.username,
            email: dto.email,
            name: dto.name,
            password: hashed,
        });
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: dto.email, password: dto.password })
            .expect(200);
        const rawCookies = loginRes.headers['set-cookie'];
        if (!rawCookies)
            throw new Error('set-cookie header is missing');
        const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
        const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
        if (!refreshCookie)
            throw new Error('refreshToken cookie is missing');
        const refreshTokenValue = refreshCookie.split(';')[0].split('=')[1];
        const accessToken = loginRes.body.token;
        await (0, supertest_1.default)(app_1.default)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshTokenValue}`)
            .expect(200);
        await (0, supertest_1.default)(app_1.default)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshTokenValue}`)
            .expect(401);
    });
});
