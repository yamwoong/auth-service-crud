import { Container } from 'typedi';
import { UserService } from '@services/user.service';
import { createDummyUser } from '@test-utils/createDummyUser';
import { User } from '@models/user.model';
import {
  TEST_USER_EMAIL,
  TEST_USER_NAME,
  TEST_USER_PASSWORD,
  TEST_USER_USERNAME,
} from '@test-utils/test-user';
import request from 'supertest';
import app from '../../app';

describe('UserService - createUser (success)', () => {
  let userService: UserService;

  // Inject a fresh instance before each test
  beforeEach(() => {
    userService = Container.get(UserService);
  });

  /**
   * @route   POST /users
   * @desc    Should create a user and return safe user data
   * @access  Public
   */
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

describe('UserService - createUser (validation fails)', () => {
  /**
   * @route   POST /users
   * @desc    Should return 400 if username is missing
   * @access  Public
   */
  it('should return 400 when username is missing', async () => {
    const res = await request(app).post('/users').send({
      email: 'test@example.com',
      name: 'Test Name',
      password: 'secret123',
    });

    expect(res.status).toBe(400);
  });

  /**
   * @route   POST /users
   * @desc    Should return 400 if email is invalid
   * @access  Public
   */
  it('should return 400 when email is invalid', async () => {
    const res = await request(app).post('/users').send({
      username: 'tester',
      email: 'not-an-email',
      name: 'Test Name',
      password: 'secret123',
    });

    expect(res.status).toBe(400);
  });

  /**
   * @route   POST /users
   * @desc    Should return 400 if password is too short
   * @access  Public
   */
  it('should return 400 when password is too short', async () => {
    const res = await request(app).post('/users').send({
      username: 'tester',
      email: 'test@example.com',
      name: 'Test Name',
      password: '123',
    });

    expect(res.status).toBe(400);
  });
});
