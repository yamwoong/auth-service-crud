// src/services/__tests__/user.create-hash.test.ts

import { Container } from 'typedi';
import { UserService } from '../user.service';
import { createDummyUser } from '@test-utils/createDummyUser';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '@test-utils/test-user';
import { UserModel } from '../../schemas/user.schema';
import { comparePassword } from '@utils/hash';

let userService: UserService;

// Resolve UserService from Typedi container before each test
beforeEach(() => {
  userService = Container.get(UserService);
});

describe('UserService – password hashing', () => {
  it('should store an Argon2 hash instead of the plain password', async () => {
    // Arrange: create a dummy user DTO with a known password
    const dto = createDummyUser();

    // Act: invoke createUser, which hashes and saves the password
    await userService.createUser(dto);

    // Assert: fetch the raw document including the hidden password field
    const raw = await UserModel.findOne({ email: TEST_USER_EMAIL })
      .select('+password') // Include the password field (select: false by default)
      .lean();

    // The document must exist
    expect(raw).not.toBeNull();

    // The stored password should start with the Argon2 prefix
    expect(raw!.password.startsWith('$argon2')).toBe(true);

    // comparePassword utility should validate the original password correctly
    const isMatch = await comparePassword(TEST_USER_PASSWORD, raw!.password);
    expect(isMatch).toBe(true);
  });
});
