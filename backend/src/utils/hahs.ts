import argon2 from 'argon2';

/**
 * Hashes a user's plaintext password using argon2.
 * @param plainPassword The plaintext password to hash
 * @returns A hashed password string
 */

export async function hashPassword(plainPassword: string): Promise<string> {
  return await argon2.hash(plainPassword);
}

/**
 * Compares a plaintext password with a hashed password.
 * @param plainPassword The plaintext password to compare
 * @param hashedPassword The previously hashed password
 * @returns A boolean indicating whether the passwords match
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await argon2.verify(hashedPassword, plainPassword);
}
