"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const user_service_1 = require("@services/user.service");
const createDummyUser_1 = require("@test-utils/createDummyUser");
const test_user_1 = require("@test-utils/test-user");
const UserAlreadyExistsError_1 = require("@errors/UserAlreadyExistsError");
describe('UserService – createUser duplicate scenarios', () => {
    let userService;
    const UNIQUE_EMAIL_1 = 'unique1@example.com';
    const UNIQUE_EMAIL_2 = 'unique2@example.com';
    beforeEach(() => {
        // Get a fresh UserService instance before each test
        userService = typedi_1.Container.get(user_service_1.UserService);
    });
    it('should throw UserAlreadyExistsError when email is already in use', async () => {
        // Arrange: prepare DTO with duplicate email
        const dto = (0, createDummyUser_1.createDummyUser)({ email: test_user_1.TEST_USER_EMAIL });
        // Act: first creation succeeds
        await userService.createUser(dto);
        // Assert: second call rejects with exactly the same error instance
        await expect(userService.createUser(dto)).rejects.toEqual(new UserAlreadyExistsError_1.UserAlreadyExistsError(dto.email));
    });
    it('should throw UserAlreadyExistsError when username is already in use', async () => {
        // Arrange: two DTOs sharing username but different emails
        const dto1 = (0, createDummyUser_1.createDummyUser)({
            username: test_user_1.TEST_USER_USERNAME,
            email: UNIQUE_EMAIL_1,
        });
        const dto2 = (0, createDummyUser_1.createDummyUser)({
            username: test_user_1.TEST_USER_USERNAME,
            email: UNIQUE_EMAIL_2,
        });
        // Act: first creation succeeds
        await userService.createUser(dto1);
        // Assert: second call rejects with exactly the same error instance
        await expect(userService.createUser(dto2)).rejects.toEqual(new UserAlreadyExistsError_1.UserAlreadyExistsError(dto2.username));
    });
});
