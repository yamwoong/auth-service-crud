import request from 'supertest';
import app from '../../app';
import { UserModel } from '@schemas/user.schema';
import { hashPassword } from '@utils/hash';
import { createDummyUserWithHashedPassword } from '@test-utils/createDummyUserWithHashedPassword';

describe('POST /auth/logout', () => {
  it('should successfully logout with valid tokens', async () => {
    const dto = await createDummyUserWithHashedPassword();
    await UserModel.create({
      username: dto.username,
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: dto.email, password: dto.password })
      .expect(200);

    const rawCookies = loginRes.headers['set-cookie'];
    if (!rawCookies) throw new Error('set-cookie header is missing');
    const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    if (!refreshCookie) throw new Error('refreshToken cookie is missing');
    const refreshTokenValue = refreshCookie.split(';')[0].split('=')[1];
    const accessToken = loginRes.body.token;

    const logoutRes = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Cookie', `refreshToken=${refreshTokenValue}`)
      .expect(200);

    const rawLogoutCookies = logoutRes.headers['set-cookie'];
    if (!rawLogoutCookies) throw new Error('set-cookie header is missing');
    const logoutCookies = Array.isArray(rawLogoutCookies) ? rawLogoutCookies : [rawLogoutCookies];
    expect(logoutCookies.some((c) => c.startsWith('refreshToken=;'))).toBe(true);

    expect(logoutRes.body).toEqual({ message: 'Logged out successfully' });
  });

  it('should return 401 when reusing a revoked token', async () => {
    const dto = await createDummyUserWithHashedPassword();
    await UserModel.create({
      username: dto.username,
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: dto.email, password: dto.password })
      .expect(200);

    const rawCookies = loginRes.headers['set-cookie'];
    if (!rawCookies) throw new Error('set-cookie header is missing');
    const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    if (!refreshCookie) throw new Error('refreshToken cookie is missing');
    const refreshTokenValue = refreshCookie.split(';')[0].split('=')[1];
    const accessToken = loginRes.body.token;

    await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Cookie', `refreshToken=${refreshTokenValue}`)
      .expect(200);

    await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Cookie', `refreshToken=${refreshTokenValue}`)
      .expect(401);
  });
});
