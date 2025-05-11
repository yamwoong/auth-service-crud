import request from 'supertest';
import app from '../../app';
import { UserModel } from '@schemas/user.schema';
import { createDummyUserWithHashedPassword } from '@test-utils/createDummyUserWithHashedPassword';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '@test-utils/test-user';

describe('PATCH /users/me/password', () => {
  let token: string;

  beforeEach(async () => {
    await UserModel.deleteMany();

    const userDto = await createDummyUserWithHashedPassword();
    await UserModel.create(userDto);

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
    token = loginRes.body.token;
  });

  it('should change password when currentPassword is correct', async () => {
    const res = await request(app)
      .patch('/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: TEST_USER_PASSWORD,
        newPassword: 'newpass123',
      });

    expect(res.status).toBe(200);

    const relogin = await request(app)
      .post('/auth/login')
      .send({ email: TEST_USER_EMAIL, password: 'newpass123' });
    expect(relogin.status).toBe(200);
    expect(relogin.body.token).toBeDefined();
  });

  it('should reject when currentPassword is wrong', async () => {
    const res = await request(app)
      .patch('/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'wrongpass',
        newPassword: 'newpass123',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/current password/i);
  });

  it('should reject when required fields are missing', async () => {
    const res = await request(app)
      .patch('/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword: 'newpass123',
      });

    expect(res.status).toBe(400);

    expect(res.body.message).toMatch(/validation failed/i);
  });

  it('should reject when Authorization header is missing', async () => {
    const res = await request(app).patch('/users/me/password').send({
      currentPassword: TEST_USER_PASSWORD,
      newPassword: 'newpass123',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });
});
