import { Request, Response } from 'express';
import { AppError } from '@errors/AppError';

const COOKIE_NAME = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN_MS) || 7 * 24 * 60 * 60 * 1000,
};

export function getRefreshTokenFromCookie(req: Request): string {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new AppError('Refresh token missing', 401);
  return token;
}

export function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
}
