import { Service } from 'typedi';
import { RefreshTokenModel } from '@schemas/refresh-token.schema';

@Service()
export class RefreshTokenRepository {
  /**
   * Stores a new refresh token for the given user.
   * @param userId – The ID of the user
   * @param token – The refresh token string
   * @usage Called after login (including Google OAuth)
   */
  public async saveToken(userId: string, token: string): Promise<void> {
    await RefreshTokenModel.create({ userId, token });
  }

  /**
   * Deletes a refresh token by its token string.
   * @param token – the refresh token to delete
   * @returns true if a record was deleted, false otherwise
   *
   */

  public async deleteByToken(token: string): Promise<boolean> {
    const result = await RefreshTokenModel.deleteOne({ token });
    return (result.deletedCount ?? 0) > 0;
  }

  /**
   * Deletes all refresh tokens for a given user ID.
   * @param userId – the user ID whose tokens to delete
   * @returns the number of tokens deleted
   *
   */

  public async deleteByUserId(userId: string): Promise<number> {
    const result = await RefreshTokenModel.deleteMany({ userId });
    return result.deletedCount ?? 0;
  }
}
