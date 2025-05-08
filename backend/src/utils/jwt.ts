import jwt from 'jsonwebtoken';
import { env } from '@config/env';

/**
 * Signs a JWT access token with the user's ID.
 * @param userId MongoDB _id string
 * @returns Signed JWT access token string
 */
export function signAuthToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

/**
 * Signs a JWT refresh token with the user's ID.
 * @param userId MongoDB _id string
 * @returns Signed JWT refresh token string
 */
export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.refreshSecret, {
    expiresIn: env.refreshExpiresIn,
  });
}

/**
 * Verifies a refresh token and extracts the payload.
 * @param token Refresh token string
 * @returns Decoded payload containing userId
 * @throws jwt.JsonWebTokenError if token is invalid
 */
export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, env.refreshSecret) as { userId: string };
}
