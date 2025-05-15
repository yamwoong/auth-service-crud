import { Container, Service, Inject } from 'typedi';
import { LoginDto } from '@dtos/auth/login.dto';
import { UserRepository } from '@repositories/user.repository';
import { RefreshTokenRepository } from '@repositories/refreshToken.repository';
import { hashPassword, verifyPasswordOrThrow } from '@utils/hash';
import { signAuthToken, signRefreshToken, verifyRefreshToken } from '@utils/jwt';
import { AppError } from '@errors/AppError';
import { AUTH_ERRORS, COMMON_ERRORS } from '@constants/errors';
import { mapMongoUserToUser } from '@mappers/user.mapper';
import { RefreshTokenModel } from '@schemas/refresh-token.schema';
import { User } from '@models/user.model';
import { MongoUser } from '@models/user-with-password.model';
import { UserService } from '@services/user.service';
import { sendResetPasswordEmail } from '@utils/mail';
import { env } from '@config/env';
import { UserModel } from '../schemas/user.schema';
import jwt from 'jsonwebtoken';

interface ResetTokenPayload {
  userId: string;
  type?: 'auth' | 'refresh' | 'reset';
  iat?: number;
  exp?: number;
}

@Service()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject()
    private readonly refreshTokenRepo: RefreshTokenRepository
  ) {}

  /**
   * Log in a user, issue access & refresh tokens,
   * store the refresh token in DB, and return both tokens + user data.
   */
  async login(dto: LoginDto): Promise<{ token: string; refreshToken: string; user: User }> {
    const { email, username, password } = dto;

    const userEntity = await this.getUserOrThrow(email, username);

    await verifyPasswordOrThrow(password, userEntity.password!);

    const userId = userEntity._id.toString();

    const accessToken = signAuthToken(userId);
    const refreshToken = signRefreshToken(userId);

    await RefreshTokenModel.create({
      userId: userId,
      token: refreshToken,
    });

    const user = mapMongoUserToUser(userEntity); // safe response

    return { token: accessToken, refreshToken, user };
  }

  /**
   * Validates a refresh token, rotates it, and issues a new access + refresh token.
   */

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyRefreshToken(token);
    const userId = payload.userId;

    const existing = await RefreshTokenModel.findOne({ token });
    if (!existing) {
      throw new AppError(AUTH_ERRORS.INVALID_CREDENTIALS, 401);
    }

    await existing.deleteOne();

    const userService = Container.get(UserService);
    const user = await userService.getUserByIdOrThrow(userId);

    const accessToken = signAuthToken(user._id.toString());
    const newRefreshToken = signRefreshToken(user._id.toString());

    await RefreshTokenModel.create({ userId: user._id.toString(), token: newRefreshToken });

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Finds a user by email or username.
   * Throws AppError(401) if user not found.
   */
  private async getUserOrThrow(email?: string, username?: string): Promise<MongoUser> {
    const user =
      email != null
        ? await this.userRepository.findByEmail(email)
        : await this.userRepository.findByUsername(username!);

    if (!user) {
      throw new AppError(AUTH_ERRORS.INVALID_CREDENTIALS, 401);
    }

    return user;
  }

  /**
   * Handles user logout by revoking the provided refresh token.
   * @param refreshToken - the token to revoke
   * @throws AppError(400) if no token provided
   * @throws AppError(401) if token invalid or already revoked
   */

  public async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new AppError(AUTH_ERRORS.NO_REFRESH_TOKEN_PROVIDED, 400);
    }

    const deleted = await this.refreshTokenRepo.deleteByToken(refreshToken);
    if (!deleted) {
      throw new AppError(AUTH_ERRORS.INVALID_CREDENTIALS, 401);
    }
  }

  /**
   * Sends a reset password email to the user's registered email address.
   * @param username The username to look up the user
   */
  public async sendResetPasswordLink(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 404);
    }

    const token = signAuthToken(user._id.toString(), '10m');

    const resetUrl = `${env.resetPasswordUrl}?token=${token}`;

    await sendResetPasswordEmail(user.email, resetUrl);
  }

  /**
   * Resets the user's password using a valid JWT reset token.
   * @param token - The JWT reset token sent to the user's email
   * @param newPassword - The new password to be hashed and saved
   */

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    let payload: ResetTokenPayload;

    try {
      payload = jwt.verify(token, env.jwtSecret) as ResetTokenPayload;
    } catch (err) {
      throw new AppError(COMMON_ERRORS.INVALID_OR_EXPIRED_TOKEN, 401);
    }

    if (payload.type && payload.type !== 'reset') {
      throw new AppError(COMMON_ERRORS.INVALID_OR_EXPIRED_TOKEN, 401);
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 404);
    }

    user.password = await hashPassword(newPassword);
    await this.userRepository.updatePassword(payload.userId, user.password);
  }
}
