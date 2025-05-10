import { Container, Service } from 'typedi';
import { LoginDto } from '@dtos/auth/login.dto';
import { UserRepository } from '@repositories/user.repository';
import { verifyPasswordOrThrow } from '@utils/hash';
import { signAuthToken, signRefreshToken, verifyRefreshToken } from '@utils/jwt';
import { AppError } from '@errors/AppError';
import { AUTH_ERRORS } from '@constants/errors';
import { mapMongoUserToUser } from '@mappers/user.mapper';
import { RefreshTokenModel } from '@schemas/refresh-token.schema';
import { User } from '@models/user.model';
import { MongoUser } from '@models/user-with-password.model';
import { UserService } from '@services/user.service';

@Service()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Log in a user, issue access & refresh tokens,
   * store the refresh token in DB, and return both tokens + user data.
   */
  async login(dto: LoginDto): Promise<{ token: string; refreshToken: string; user: User }> {
    const { email, username, password } = dto;

    const userEntity = await this.getUserOrThrow(email, username);

    await verifyPasswordOrThrow(password, userEntity.password);

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
}
