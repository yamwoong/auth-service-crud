import request from 'supertest';
import app from '../../app';
import { UserModel } from '@schemas/user.schema';
import { RefreshTokenModel } from '@schemas/refresh-token.schema';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '@test-utils/test-user';
import { createDummyUser } from '@test-utils/createDummyUser';

describe('POST /auth/refresh', () => {
  const userDto = createDummyUser();

  beforeEach(async () => {
    await UserModel.deleteMany();
    await RefreshTokenModel.deleteMany();
  });

  it('should issue a new access token if valid refresh token cookie is sent', async () => {
    // 회원가입
    await request(app).post('/users').send(userDto).expect(201);

    // 로그인
    const loginRes = await request(app).post('/auth/login').send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    const setCookies = Array.isArray(loginRes.headers['set-cookie'])
      ? loginRes.headers['set-cookie']
      : [loginRes.headers['set-cookie']];

    const refreshTokenCookie = setCookies.find((cookie) => cookie.startsWith('refreshToken='));

    if (!refreshTokenCookie) return fail('refreshToken cookie was not set after login.');

    const refreshTokenHeader = refreshTokenCookie.match(/^refreshToken=([^;]+)/)?.[0];
    if (!refreshTokenHeader) return fail('Failed to extract refreshToken from cookie.');

    // /auth/refresh 요청
    const res = await request(app)
      .post('/auth/refresh')
      .set('Host', 'localhost')
      .set('Cookie', refreshTokenHeader)
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(typeof res.body.accessToken).toBe('string');
  });

  it('should return 401 if refresh token cookie is missing', async () => {
    const res = await request(app).post('/auth/refresh');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Refresh token missing');
  });
});
