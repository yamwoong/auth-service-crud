import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { env } from '@config/env';
import { AppError } from '@errors/AppError';
import { AUTH_ERRORS } from '@constants/errors';
import { UserRepository } from '@repositories/user.repository';
import { Container } from 'typedi';
import { mapMongoUserToUser } from '@mappers/user.mapper';
import { User } from '@models/user.model';

/**
 * Extends Express Request to include authenticated user.
 */
export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Middleware to authenticate requests using JWT.
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED, 401);
    }
    const token = authHeader.slice(7).trim();

    let payload: { userId: string };
    try {
      payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new AppError(AUTH_ERRORS.UNAUTHORIZED, 401);
      }
      throw err;
    }

    const repo = Container.get(UserRepository);
    const mongoUser = await repo.findById(payload.userId);
    if (!mongoUser) {
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED, 401);
    }

    req.user = mapMongoUserToUser(mongoUser);

    next();
  } catch (err) {
    next(err);
  }
};
