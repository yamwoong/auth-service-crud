import request from 'supertest';
import app from '../../app';
import { UserModel } from '@schemas/user.schema';
import { createDummyUserWithHashedPassword } from '@test-utils/createDummyUserWithHashedPassword';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '@test-utils/test-user';

describe('POST /auth/login', () => {
  beforeEach(async () => {
    await UserModel.deleteMany();

    const user = await createDummyUserWithHashedPassword();

    await UserModel.create(user);
  });

  it('should login successfully with correct email and password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should fail with incorrect password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: TEST_USER_EMAIL,
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should fail when email is missing', async () => {
    const res = await request(app).post('/auth/login').send({
      password: TEST_USER_PASSWORD,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/validation failed/i);
  });

  it('should fail when user does not exist', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: TEST_USER_PASSWORD,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});
