"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../app"));
const user_schema_1 = require("@schemas/user.schema");
const jwt_1 = require("@utils/jwt");
const hash_1 = require("@utils/hash");
describe('POST /auth/reset-password', () => {
    it('resets password when given a valid token', async () => {
        const oldPassword = 'oldPass123';
        const hashed = await (0, hash_1.hashPassword)(oldPassword);
        const user = await user_schema_1.UserModel.create({
            username: 'testuser',
            email: 'test@example.com',
            name: 'Test',
            provider: 'local',
            password: hashed,
        });
        const token = (0, jwt_1.signAuthToken)(user._id.toString(), '10m');
        const newPassword = 'brandNew456';
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/reset-password').send({ token, newPassword });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Password has been reset successfully.' });
        const updated = await user_schema_1.UserModel.findById(user._id).select('+password');
        expect(updated).not.toBeNull();
        expect(await (0, hash_1.comparePassword)(newPassword, updated.password)).toBe(true);
    });
    it('returns 401 for an invalid or malformed token', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/reset-password')
            .send({ token: 'not-a-jwt', newPassword: 'anything123' });
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/Invalid or expired token/);
    });
    it('returns 404 if token is valid but user does not exist', async () => {
        const fakeId = new mongoose_1.default.Types.ObjectId().toString();
        const token = (0, jwt_1.signAuthToken)(fakeId, '10m');
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/reset-password')
            .send({ token, newPassword: 'whatever123' });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
    });
});
