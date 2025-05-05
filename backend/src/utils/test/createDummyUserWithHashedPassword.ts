import { CreateUserDto } from '@dtos/user/create-user.dto';
import { hashPassword } from '@utils/hahs';
import {
  TEST_USER_EMAIL,
  TEST_USER_NAME,
  TEST_USER_PASSWORD,
  TEST_USER_USERNAME,
} from './test-user';

/**
 * Creates a user DTO with a hashed password for authentication-related tests.
 * Use this when directly inserting into the DB for login tests or password checks.
 */

export async function createDummyUserWithHashedPassword(
  overrides?: Partial<CreateUserDto>
): Promise<CreateUserDto> {
  const rawPassword = overrides?.password ?? TEST_USER_PASSWORD;
  const hashedPassword = await hashPassword(rawPassword);

  return {
    username: TEST_USER_USERNAME,
    email: TEST_USER_EMAIL,
    name: TEST_USER_NAME,
    ...overrides,
    password: hashedPassword, // Ensure password override happens last
  };
}
