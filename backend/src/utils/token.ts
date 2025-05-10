import type { Request } from 'express';
import { AppError } from '@errors/AppError';
import { AUTH_ERRORS } from '@constants/errors';

/**
 * Extracts the raw JWT string from the Authorization header.
 *
 * @param req Express Request
 * @returns the token string (without the "Bearer " prefix)
 * @throws AppError(401) if header is missing or malformed
 */
export function extractToken(req: Request): string {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(AUTH_ERRORS.UNAUTHORIZED, 401);
  }

  return authHeader.slice(7).trim();
}
