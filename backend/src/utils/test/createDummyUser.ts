import { CreateUserDto } from '@dtos/user/create-user.dto';
import {
  TEST_USER_EMAIL,
  TEST_USER_NAME,
  TEST_USER_PASSWORD,
  TEST_USER_USERNAME,
} from './test-user';

/**
 * Creates a default user DTO for basic tests (non-hashed password).
 * Use this for simple creation, validation, or duplication tests
 * where password hashing is not required.
 */
export function createDummyUser(overrides?: Partial<CreateUserDto>): CreateUserDto {
  return {
    username: TEST_USER_USERNAME,
    email: TEST_USER_EMAIL,
    name: TEST_USER_NAME,
    password: TEST_USER_PASSWORD,
    ...overrides,
  };
}
