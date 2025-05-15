"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const user_schema_1 = require("@schemas/user.schema");
const refresh_token_schema_1 = require("@schemas/refresh-token.schema");
const test_user_1 = require("@test-utils/test-user");
const createDummyUser_1 = require("@test-utils/createDummyUser");
describe('POST /auth/refresh', () => {
    const userDto = (0, createDummyUser_1.createDummyUser)();
    beforeEach(async () => {
        await user_schema_1.UserModel.deleteMany();
        await refresh_token_schema_1.RefreshTokenModel.deleteMany();
    });
    it('should issue a new access token if valid refresh token cookie is sent', async () => {
        // 회원가입
        await (0, supertest_1.default)(app_1.default).post('/users').send(userDto).expect(201);
        // 로그인
        const loginRes = await (0, supertest_1.default)(app_1.default).post('/auth/login').send({
            email: test_user_1.TEST_USER_EMAIL,
            password: test_user_1.TEST_USER_PASSWORD,
        });
        const setCookies = Array.isArray(loginRes.headers['set-cookie'])
            ? loginRes.headers['set-cookie']
            : [loginRes.headers['set-cookie']];
        const refreshTokenCookie = setCookies.find((cookie) => cookie.startsWith('refreshToken='));
        if (!refreshTokenCookie)
            return fail('refreshToken cookie was not set after login.');
        const refreshTokenHeader = refreshTokenCookie.match(/^refreshToken=([^;]+)/)?.[0];
        if (!refreshTokenHeader)
            return fail('Failed to extract refreshToken from cookie.');
        // /auth/refresh 요청
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/refresh')
            .set('Host', 'localhost')
            .set('Cookie', refreshTokenHeader)
            .expect(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(typeof res.body.accessToken).toBe('string');
    });
    it('should return 401 if refresh token cookie is missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/refresh');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Refresh token missing');
    });
});
