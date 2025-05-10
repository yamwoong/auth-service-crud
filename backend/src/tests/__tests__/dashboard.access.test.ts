import request from 'supertest';
import app from '../../app';
import { UserModel } from '@schemas/user.schema';
import { createDummyUserWithHashedPassword } from '@test-utils/createDummyUserWithHashedPassword';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '@test-utils/test-user';

describe('GET /dashboard', () => {
  let token: string;

  beforeEach(async () => {
    await UserModel.deleteMany();

    const user = await createDummyUserWithHashedPassword();
    await UserModel.create(user);

    const res = await request(app).post('/auth/login').send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    token = res.body.token;
  });

  it('should allow access with valid token', async () => {
    const res = await request(app).get('/dashboard').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/welcome/i);
  });

  it('should reject access without token', async () => {
    const res = await request(app).get('/dashboard');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  it('should reject access with invalid token', async () => {
    const res = await request(app).get('/dashboard').set('Authorization', `Bearer invalid-token`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });
});
