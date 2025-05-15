"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDummyUser = createDummyUser;
const test_user_1 = require("./test-user");
/**
 * Creates a default user DTO for basic tests (non-hashed password).
 * Use this for simple creation, validation, or duplication tests
 * where password hashing is not required.
 */
function createDummyUser(overrides) {
    return {
        username: test_user_1.TEST_USER_USERNAME,
        email: test_user_1.TEST_USER_EMAIL,
        name: test_user_1.TEST_USER_NAME,
        password: test_user_1.TEST_USER_PASSWORD,
        ...overrides,
    };
}
