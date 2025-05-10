// src/services/user.service.ts

import { Service } from 'typedi';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { User } from '@models/user.model';
import { UserAlreadyExistsError } from '../errors/UserAlreadyExistsError';
import { hashPassword } from '@utils/hash';
import { AUTH_ERRORS } from '@constants/errors';
import { AppError } from '@errors/AppError';
import { MongoUser } from '@models/user-with-password.model';
import { comparePassword } from '@utils/hash';

@Service()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Retrieve all users.
   * Primarily used for administrative or debugging purposes.
   */
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  /**
   * Create a new user after verifying uniqueness and hashing the password.
   * @param data - The user's registration input.
   * @returns The created user without exposing the password.
   * @throws UserAlreadyExistsError if either email or username is already in use.
   */
  async createUser(data: CreateUserDto): Promise<User> {
    // 1. Determine which field conflicts, if any
    const conflict = await this.userRepository.findConflictField(data.email, data.username);

    if (conflict) {
      // 2. If conflict, pick the appropriate identifier and throw
      const identifier = conflict === 'email' ? data.email : data.username;
      throw new UserAlreadyExistsError(identifier);
    }

    // 3. No conflict: hash password and create
    const hashed = await hashPassword(data.password);
    return this.userRepository.create({ ...data, password: hashed });
  }

  /**
   * Updates a user's password after verifying the current password.
   *
   * @param userId - The ID of the authenticated user
   * @param currentPassword - The user's current password for verification
   * @param newPassword - The new password to be hashed and saved
   * @throws UserNotFoundError - If no user exists with the given ID
   * @throws InvalidPasswordError - If the current password is incorrect
   */

  async updatePassword(
    userid: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.getUserByIdOrThrow(userid);

    const isMatch = await comparePassword(currentPassword, user.password);

    if (!isMatch) {
      throw new AppError(AUTH_ERRORS.INVALID_CURRENT_PASSWORD, 401);
    }

    const hashed = await hashPassword(newPassword);

    await this.userRepository.updatePassword(userid, hashed);
  }

  /**
   * Retrieves a user by ID or throws a 404 error if not found.
   *
   * @param userId - MongoDB ObjectId of the user
   * @returns The user document
   * @throws AppError with 404 if user does not exist
   */

  public async getUserByIdOrThrow(userId: string): Promise<MongoUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, 404);
    }
    return user;
  }
}
