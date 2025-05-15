"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const user_service_1 = require("@services/user.service");
const createDummyUser_1 = require("@test-utils/createDummyUser");
const test_user_1 = require("@test-utils/test-user");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
describe('UserService - createUser (success)', () => {
    let userService;
    // Inject a fresh instance before each test
    beforeEach(() => {
        userService = typedi_1.Container.get(user_service_1.UserService);
    });
    /**
     * @route   POST /users
     * @desc    Should create a user and return safe user data
     * @access  Public
     */
    it('should create a user and return safe user data', async () => {
        // Arrange: create a dummy user DTO with test email
        const dto = (0, createDummyUser_1.createDummyUser)({ email: test_user_1.TEST_USER_EMAIL });
        // Act: attempt to create the user via the service
        const user = await userService.createUser(dto);
        // Assert 1: returned user should match input data (excluding password)
        expect(user).toMatchObject({
            username: test_user_1.TEST_USER_USERNAME,
            email: test_user_1.TEST_USER_EMAIL,
            name: test_user_1.TEST_USER_NAME,
        });
        // Assert 2: should have an 'id' field (converted from _id by the mapper)
        expect(user).toHaveProperty('id');
        // Assert 3: should NOT include 'password' in the final response model
        expect('password' in user).toBe(false);
    });
});
describe('UserService - createUser (validation fails)', () => {
    /**
     * @route   POST /users
     * @desc    Should return 400 if username is missing
     * @access  Public
     */
    it('should return 400 when username is missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/users').send({
            email: 'test@example.com',
            name: 'Test Name',
            password: 'secret123',
        });
        expect(res.status).toBe(400);
    });
    /**
     * @route   POST /users
     * @desc    Should return 400 if email is invalid
     * @access  Public
     */
    it('should return 400 when email is invalid', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/users').send({
            username: 'tester',
            email: 'not-an-email',
            name: 'Test Name',
            password: 'secret123',
        });
        expect(res.status).toBe(400);
    });
    /**
     * @route   POST /users
     * @desc    Should return 400 if password is too short
     * @access  Public
     */
    it('should return 400 when password is too short', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/users').send({
            username: 'tester',
            email: 'test@example.com',
            name: 'Test Name',
            password: '123',
        });
        expect(res.status).toBe(400);
    });
});
