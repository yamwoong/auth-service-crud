import { Service } from 'typedi';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { User } from '../models/user.model';
import { mapMongoUserToUser } from '../mappers/user.mapper';
import { UserModel } from '../schemas/user.schema';
import { MongoUser } from '../models/user-with-password.model';

@Service()
export class UserRepository {
  /**
   * Retrieves all users from the database.
   * Typically used for admin or test purposes.
   * Avoid using in production unless necessary due to potential performance impact.
   */

  async findAll(): Promise<User[]> {
    const users = await UserModel.find().lean();
    return users.map(mapMongoUserToUser);
  }

  /**
   * Creates a new user in the database.
   * Converts the raw MongoDB document into a clean domain model.
   */

  async create(data: CreateUserDto): Promise<User> {
    const created = await UserModel.create(data);
    return mapMongoUserToUser(created.toObject());
  }

  /**
   * Finds a user by email.
   * Commonly used for login or email duplication checks.
   */

  async findByEmail(email: string): Promise<MongoUser | null> {
    return await UserModel.findOne({ email }).select('+password').lean<MongoUser>();
  }

  /**
   * Finds a user by username.
   * Used in login or username duplication checks.
   */

  async findByUsername(username: string): Promise<MongoUser | null> {
    return await UserModel.findOne({ username }).select('+password').lean<MongoUser>();
  }

  /**
   * Finds a user by ID.
   * Used in auth middleware (JWT validation).
   */

  async findById(id: string): Promise<MongoUser | null> {
    return await UserModel.findById(id).select('+password');
  }

  /**
   * Checks whether a user exists with the given email or username.
   * Used to detect duplicate users during registration.
   * Optimized by selecting only the _id field and using lean() for performance.
   */

  async existsByEmailOrUsername(email: string, username: string): Promise<boolean> {
    const user = await UserModel.findOne({
      $or: [{ email }, { username }],
    })
      .select('_id')
      .lean();

    return !!user;
  }

  /**
   * Determines which field is causing a conflict.
   * Returns 'email' if the email is already taken,
   * 'username' if the username is already taken,
   * or null if no conflict.
   */

  async findConflictField(email: string, username: string): Promise<'email' | 'username' | null> {
    const user = await UserModel.findOne({
      $or: [{ email }, { username }],
    })
      .select('email username')
      .lean();

    if (!user) {
      return null;
    }
    // If the stored document's email matches, it's an email conflict
    return user.email === email ? 'email' : 'username';
  }

  /**
   * Updates a user's password.
   * This operation is used in password change and reset flows.
   * Only updates the password field.
   *
   * @param userId - The user's MongoDB ID
   * @param hashedPassword - The new password hash to store
   */

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: false, lean: true }
    );
  }
}
