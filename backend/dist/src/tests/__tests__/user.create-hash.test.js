"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const user_service_1 = require("@services/user.service");
const createDummyUser_1 = require("@test-utils/createDummyUser");
const test_user_1 = require("@test-utils/test-user");
const user_schema_1 = require("@schemas/user.schema");
const hash_1 = require("@utils/hash");
let userService;
// Get a fresh UserService instance before each test
beforeEach(() => {
    userService = typedi_1.Container.get(user_service_1.UserService);
});
// Clean up database and reset DI container after each test
afterEach(async () => {
    await user_schema_1.UserModel.deleteMany({});
    typedi_1.Container.reset();
});
describe('UserService – password hashing', () => {
    it('should store an Argon2 hash instead of the plain password', async () => {
        // Arrange: create a dummy user DTO with a known password
        const dto = (0, createDummyUser_1.createDummyUser)();
        // Act: call createUser, which should hash and save the password
        await userService.createUser(dto);
        // Assert: fetch the raw user document including the hidden password field
        const userRecord = await user_schema_1.UserModel.findOne({ email: test_user_1.TEST_USER_EMAIL })
            .select('+password') // Override select:false to include password
            .lean();
        // Ensure the user record exists
        expect(userRecord).not.toBeNull();
        // Check that the stored password starts with the Argon2 prefix
        expect(userRecord.password).toMatch(/^\$argon2/);
        // Verify the hash matches the original password
        const isMatch = await (0, hash_1.comparePassword)(test_user_1.TEST_USER_PASSWORD, userRecord.password);
        expect(isMatch).toBe(true);
    });
});
