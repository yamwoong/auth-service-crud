import { Container } from 'typedi';
import { UserService } from '@services/user.service';
import { createDummyUser } from '@test-utils/createDummyUser';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '@test-utils/test-user';
import { UserModel } from '@schemas/user.schema';
import { comparePassword } from '@utils/hash';

let userService: UserService;

// Get a fresh UserService instance before each test
beforeEach(() => {
  userService = Container.get(UserService);
});

// Clean up database and reset DI container after each test
afterEach(async () => {
  await UserModel.deleteMany({});
  Container.reset();
});

describe('UserService – password hashing', () => {
  it('should store an Argon2 hash instead of the plain password', async () => {
    // Arrange: create a dummy user DTO with a known password
    const dto = createDummyUser();

    // Act: call createUser, which should hash and save the password
    await userService.createUser(dto);

    // Assert: fetch the raw user document including the hidden password field
    const userRecord = await UserModel.findOne({ email: TEST_USER_EMAIL })
      .select('+password') // Override select:false to include password
      .lean();

    // Ensure the user record exists
    expect(userRecord).not.toBeNull();

    // Check that the stored password starts with the Argon2 prefix
    expect(userRecord!.password).toMatch(/^\$argon2/);

    // Verify the hash matches the original password
    const isMatch = await comparePassword(TEST_USER_PASSWORD, userRecord!.password);
    expect(isMatch).toBe(true);
  });
});
