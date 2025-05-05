import { AppError } from './AppError';
/**
 * Thrown when attempting to register a user with an existing email or username.
 * Returns HTTP 409 Conflict.
 */

export class UserAlreadyExistsError extends AppError {
  constructor(identifier: string) {
    super(`User with identifier '${identifier}' already exists`, 409);
  }
}
