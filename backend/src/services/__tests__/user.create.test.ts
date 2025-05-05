import { Container } from 'typedi';
import { UserService } from '../user.service';
import { createDummyUser } from '@test-utils/createDummyUser';
import { User } from '@models/user.model';
import { TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_USERNAME } from '@test-utils/test-user';

describe('UserService - createUser (success)', () => {
  let userService: UserService;

  // Inject a fresh instance before each test
  beforeEach(() => {
    userService = Container.get(UserService);
  });

  it('should create a user and return safe user data', async () => {
    // Arrange: create a dummy user DTO with test email
    const dto = createDummyUser({ email: TEST_USER_EMAIL });

    // Act: attempt to create the user via the service
    const user: User = await userService.createUser(dto);

    // Assert 1: returned user should match input data (excluding password)
    expect(user).toMatchObject({
      username: TEST_USER_USERNAME,
      email: TEST_USER_EMAIL,
      name: TEST_USER_NAME,
    });

    // Assert 2: should have an 'id' field (converted from _id by the mapper)
    expect(user).toHaveProperty('id');

    // Assert 3: should NOT include 'password' in the final response model
    expect('password' in user).toBe(false);
  });
});
