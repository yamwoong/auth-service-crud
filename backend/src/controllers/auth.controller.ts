import { Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@services/auth.service';
import { LoginDto } from '@dtos/auth/login.dto';
import { loginSchema } from '@validations/auth.validation';
import { asyncHandler } from '@utils/asyncHandler';
import { getRefreshTokenFromCookie, setRefreshTokenCookie } from '@utils/cookies';
import { updatePasswordSchema } from '@validations/user.validation';
import { UserService } from '@services/user.service';
import { buildGoogleOAuthURL } from '@utils/google';
import { getGoogleTokens, getGoogleUserInfo } from '@utils/google';
import { signAuthToken, signRefreshToken } from '@utils/jwt';
import { forgotPasswordSchema } from '@dtos/auth/forgot-password.dto';
import { resetPasswordSchema } from '@dtos/auth/reset-password.dto';
import { RefreshTokenRepository } from '@repositories/refreshToken.repository';

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

/**
 * @route   POST /auth/logout
 * @desc    Revoke refresh token and clear cookie
 * @access  Private
 */

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req);
  const authService = Container.get(AuthService);
  await authService.logout(refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});
/**
 *
 * @route GET /auth/google
 * @desc Redirects user to Google OAuth2 login page
 * @access Public
 *
 */

export const googleAuthRedirect = (req: Request, res: Response) => {
  const googleAuthUrl = buildGoogleOAuthURL();
  return res.redirect(googleAuthUrl);
};

/**
 * @route   GET /auth/google/callback
 * @desc    Handle Google OAuth2 callback and log in the user
 * @access  Public
 */

export const googleAuthCallback = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).json({ message: 'Authorization code not provided' });
    return;
  }

  const { access_token } = await getGoogleTokens(code);

  const { email, name, id: googleId } = await getGoogleUserInfo(access_token);

  const userService = Container.get(UserService);
  const user = await userService.findOrCreateGoogleUser(email, name, googleId);

  const accessToken = signAuthToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  const refreshTokenRepo = Container.get(RefreshTokenRepository);
  await refreshTokenRepo.saveToken(user.id, refreshToken);

  setRefreshTokenCookie(res, refreshToken);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
  return res.redirect(`${frontendUrl}/oauth-success?token=${accessToken}`);
});

/**
 * @route   POST /auth/forgot-password
 * @desc    Send password reset email for the given username
 * @access  Public
 */

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { username } = await forgotPasswordSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const authService = Container.get(AuthService);
  await authService.sendResetPasswordLink(username);

  res.status(200).json({
    message: 'If an account with that username exists, a password reset email has been sent.',
  });
});

/**
 * @route   POST /auth/reset-password
 * @desc    Reset user's password using JWT token
 * @access  Public
 */

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = await resetPasswordSchema.validateAsync(req.body, {
    abortEarly: false,
  });
  const authService = Container.get(AuthService);
  await authService.resetPassword(token, newPassword);
  res.status(200).json({ message: 'Password has been reset successfully.' });
});
