import { Service } from 'typedi';
import { LoginDto } from '@dtos/auth/login.dto';
import { UserRepository } from '@repositories/user.repository';
import { verifyPasswordOrThrow } from '@utils/hash';
import { signAuthToken, signRefreshToken } from '@utils/jwt';
import { AppError } from '@errors/AppError';
import { AUTH_ERRORS } from '@constants/errors';
import { mapMongoUserToUser } from '@mappers/user.mapper';
import { RefreshTokenModel } from '@schemas/refresh-token.schema';
import { User } from '@models/user.model';
import { MongoUser } from '@models/user-with-password.model';

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

    const accessToken = signAuthToken(userEntity._id.toString());
    const refreshToken = signRefreshToken(userEntity._id.toString());

    await RefreshTokenModel.create({
      userId: userEntity._id,
      token: refreshToken,
    });

    const user = mapMongoUserToUser(userEntity); // safe response

    return { token: accessToken, refreshToken, user };
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
