// src/services/user.service.ts

import { Service } from 'typedi';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { User } from '@models/user.model';
import { UserAlreadyExistsError } from '../errors/UserAlreadyExistsError';
import { hashPassword } from '@utils/hash';

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
}
