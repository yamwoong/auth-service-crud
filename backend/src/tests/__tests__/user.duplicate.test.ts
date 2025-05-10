import { Container } from 'typedi';
import { UserService } from '@services/user.service';
import { createDummyUser } from '@test-utils/createDummyUser';
import { TEST_USER_EMAIL, TEST_USER_USERNAME } from '@test-utils/test-user';
import { UserAlreadyExistsError } from '@errors/UserAlreadyExistsError';

describe('UserService – createUser duplicate scenarios', () => {
  let userService: UserService;

  const UNIQUE_EMAIL_1 = 'unique1@example.com';
  const UNIQUE_EMAIL_2 = 'unique2@example.com';

  beforeEach(() => {
    // Get a fresh UserService instance before each test
    userService = Container.get(UserService);
  });

  it('should throw UserAlreadyExistsError when email is already in use', async () => {
    // Arrange: prepare DTO with duplicate email
    const dto = createDummyUser({ email: TEST_USER_EMAIL });

    // Act: first creation succeeds
    await userService.createUser(dto);

    // Assert: second call rejects with exactly the same error instance
    await expect(userService.createUser(dto)).rejects.toEqual(
      new UserAlreadyExistsError(dto.email)
    );
  });

  it('should throw UserAlreadyExistsError when username is already in use', async () => {
    // Arrange: two DTOs sharing username but different emails
    const dto1 = createDummyUser({
      username: TEST_USER_USERNAME,
      email: UNIQUE_EMAIL_1,
    });
    const dto2 = createDummyUser({
      username: TEST_USER_USERNAME,
      email: UNIQUE_EMAIL_2,
    });

    // Act: first creation succeeds
    await userService.createUser(dto1);

    // Assert: second call rejects with exactly the same error instance
    await expect(userService.createUser(dto2)).rejects.toEqual(
      new UserAlreadyExistsError(dto2.username)
    );
  });
});
