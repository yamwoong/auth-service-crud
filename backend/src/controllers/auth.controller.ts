import { Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@services/auth.service';
import { LoginDto } from '@dtos/auth/login.dto';
import { loginSchema } from '@validations/auth.validation';
import { asyncHandler } from '@utils/asyncHandler';
import { getRefreshTokenFromCookie, setRefreshTokenCookie } from '@utils/cookies';
import { updatePasswordSchema } from '@validations/user.validation';
import { UserService } from '@services/user.service';

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

  const { token, refreshToken, user } = await authService.login(dto);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ token, user });
});

/**
 * @route   POST /auth/refresh
 * @desc    Validate Refresh Token and issue new Access & Refresh tokens
 * @access  Public
 */

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const existing = getRefreshTokenFromCookie(req);

  const authService = Container.get(AuthService);

  const { accessToken, refreshToken: newRefresh } = await authService.refreshToken(existing);

  setRefreshTokenCookie(res, newRefresh);

  res.status(200).json({ accessToken });
});

/**
 * @route   PATCH /users/me/password
 * @desc    Update user's password after verifying current password
 * @access  Private
 */

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as Request & { user: { id: string } }).user;

  const dto = await updatePasswordSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const userService = Container.get(UserService);

  await userService.updatePassword(user.id, dto.currentPassword, dto.newPassword);

  res.status(200).json({ message: 'Password updated successfully' });
});
