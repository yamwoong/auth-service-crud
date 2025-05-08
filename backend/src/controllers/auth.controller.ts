import { Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@services/auth.service';
import { LoginDto } from '@dtos/auth/login.dto';
import { loginSchema } from '@validations/auth.schema';
import { asyncHandler } from '@utils/asyncHandler';

/**
 * @route   POST /auth/login
 * @desc    Login a user and return JWT token
 * @access  Public
 */

export const login = asyncHandler(async (req: Request, res: Response) => {
  const dto: LoginDto = await loginSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const authService = Container.get(AuthService);

  const { token, user } = await authService.login(dto);

  res.status(200).json({ token, user });
});
