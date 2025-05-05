import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '@dtos/user/create-user.dto';
import { asyncHandler } from 'utils/asyncHandler';

const userService = Container.get(UserService);

export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userData: CreateUserDto = req.body;
  const createdUser = await userService.createUser(userData);
  res.status(201).json(createdUser);
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.findAllUsers();
  res.status(200).json(users);
});
