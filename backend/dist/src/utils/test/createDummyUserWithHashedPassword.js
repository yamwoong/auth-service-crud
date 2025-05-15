"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDummyUserWithHashedPassword = createDummyUserWithHashedPassword;
const hash_1 = require("@utils/hash");
const test_user_1 = require("./test-user");
/**
 * Creates a user DTO with a hashed password for authentication-related tests.
 * Use this when directly inserting into the DB for login tests or password checks.
 */
async function createDummyUserWithHashedPassword(overrides) {
    const rawPassword = overrides?.password ?? test_user_1.TEST_USER_PASSWORD;
    const hashedPassword = await (0, hash_1.hashPassword)(rawPassword);
    return {
        username: test_user_1.TEST_USER_USERNAME,
        email: test_user_1.TEST_USER_EMAIL,
        name: test_user_1.TEST_USER_NAME,
        ...overrides,
        password: hashedPassword, // Ensure password override happens last
    };
}
