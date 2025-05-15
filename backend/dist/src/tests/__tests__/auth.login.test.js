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
describe('POST /auth/login', () => {
    beforeEach(async () => {
        await user_schema_1.UserModel.deleteMany();
        const user = await (0, createDummyUserWithHashedPassword_1.createDummyUserWithHashedPassword)();
        await user_schema_1.UserModel.create(user);
    });
    it('should login successfully with correct email and password', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/login').send({
            email: test_user_1.TEST_USER_EMAIL,
            password: test_user_1.TEST_USER_PASSWORD,
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
    });
    it('should fail with incorrect password', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/login').send({
            email: test_user_1.TEST_USER_EMAIL,
            password: 'wrongpassword',
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/invalid credentials/i);
    });
    it('should fail when email is missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/login').send({
            password: test_user_1.TEST_USER_PASSWORD,
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/validation failed/i);
    });
    it('should fail when user does not exist', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/login').send({
            email: 'nonexistent@example.com',
            password: test_user_1.TEST_USER_PASSWORD,
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/invalid credentials/i);
    });
});
