import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { UserModel } from '@schemas/user.schema';
import { signAuthToken } from '@utils/jwt';
import { hashPassword, comparePassword } from '@utils/hash';

describe('POST /auth/reset-password', () => {
  it('resets password when given a valid token', async () => {
    const oldPassword = 'oldPass123';
    const hashed = await hashPassword(oldPassword);
    const user = await UserModel.create({
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test',
      provider: 'local',
      password: hashed,
    });

    const token = signAuthToken(user._id.toString(), '10m');

    const newPassword = 'brandNew456';
    const res = await request(app).post('/auth/reset-password').send({ token, newPassword });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Password has been reset successfully.' });

    const updated = await UserModel.findById(user._id).select('+password');
    expect(updated).not.toBeNull();
    expect(await comparePassword(newPassword, updated!.password!)).toBe(true);
  });

  it('returns 401 for an invalid or malformed token', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ token: 'not-a-jwt', newPassword: 'anything123' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Invalid or expired token/);
  });

  it('returns 404 if token is valid but user does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const token = signAuthToken(fakeId, '10m');

    const res = await request(app)
      .post('/auth/reset-password')
      .send({ token, newPassword: 'whatever123' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
