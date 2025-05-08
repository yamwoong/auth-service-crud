import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };

    const userRepository = Container.get(UserRepository);
    const mongoUser = await userRepository.findById(decoded.userId);

    if (!mongoUser) {
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED, 401);
    }

    // Bind user safely to the request object
    req.user = mapMongoUserToUser(mongoUser);

    next();
  } catch (err) {
    next(err);
  }
};
