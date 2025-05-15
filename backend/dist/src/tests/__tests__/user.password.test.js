"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const user_schema_1 = require("@schemas/user.schema");
const createDummyUserWithHashedPassword_1 = require("@test-utils/createDummyUserWithHashedPassword");
const test_user_1 = require("@test-utils/test-user");
describe('PATCH /users/me/password', () => {
    let token;
    beforeEach(async () => {
        await user_schema_1.UserModel.deleteMany();
        const userDto = await (0, createDummyUserWithHashedPassword_1.createDummyUserWithHashedPassword)();
        await user_schema_1.UserModel.create(userDto);
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: test_user_1.TEST_USER_EMAIL, password: test_user_1.TEST_USER_PASSWORD });
        token = loginRes.body.token;
    });
    it('should change password when currentPassword is correct', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch('/users/me/password')
            .set('Authorization', `Bearer ${token}`)
            .send({
            currentPassword: test_user_1.TEST_USER_PASSWORD,
            newPassword: 'newpass123',
        });
        expect(res.status).toBe(200);
        const relogin = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: test_user_1.TEST_USER_EMAIL, password: 'newpass123' });
        expect(relogin.status).toBe(200);
        expect(relogin.body.token).toBeDefined();
    });
    it('should reject when currentPassword is wrong', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch('/users/me/password')
            .set('Authorization', `Bearer ${token}`)
            .send({
            currentPassword: 'wrongpass',
            newPassword: 'newpass123',
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/current password/i);
    });
    it('should reject when required fields are missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch('/users/me/password')
            .set('Authorization', `Bearer ${token}`)
            .send({
            newPassword: 'newpass123',
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/validation failed/i);
    });
    it('should reject when Authorization header is missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).patch('/users/me/password').send({
            currentPassword: test_user_1.TEST_USER_PASSWORD,
            newPassword: 'newpass123',
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/unauthorized/i);
    });
});
