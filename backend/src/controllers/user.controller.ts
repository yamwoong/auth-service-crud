import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '@dtos/user/create-user.dto';
import { createUserSchema } from '@validations/user.schema';
import { asyncHandler } from '@utils/asyncHandler';

const userService = Container.get(UserService);

/**
@route   POST /users
@desc    Create a new user (with Joi validation)
@access  Public
 */

export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validated = await createUserSchema.validateAsync(req.body, { abortEarly: false });

  const userData: CreateUserDto = validated;

  const createdUser = await userService.createUser(userData);
  res.status(201).json(createdUser);
});

/**
@route   GET /users
@desc    Get all users
@access  Public
*/

export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.findAllUsers();
  res.status(200).json(users);
});
