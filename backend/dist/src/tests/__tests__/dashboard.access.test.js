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
describe('GET /dashboard', () => {
    let token;
    beforeEach(async () => {
        await user_schema_1.UserModel.deleteMany();
        const user = await (0, createDummyUserWithHashedPassword_1.createDummyUserWithHashedPassword)();
        await user_schema_1.UserModel.create(user);
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/login').send({
            email: test_user_1.TEST_USER_EMAIL,
            password: test_user_1.TEST_USER_PASSWORD,
        });
        token = res.body.token;
    });
    it('should allow access with valid token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/dashboard').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/welcome/i);
    });
    it('should reject access without token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/dashboard');
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/unauthorized/i);
    });
    it('should reject access with invalid token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/dashboard').set('Authorization', `Bearer invalid-token`);
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/unauthorized/i);
    });
});
