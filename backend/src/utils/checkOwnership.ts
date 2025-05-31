import { AppError } from '@errors/AppError';
import { POST_ERRORS } from '@constants/errors';

/**
 * Throws 403 if the user is not the resource owner.
 * @param resourceAuthorId - The user ID of the resource (e.g., post.authorId)
 * @param userId - The currently logged-in user ID
 */

export function checkOwnership(resourceAuthorId: string, userId: string) {
  if (resourceAuthorId !== userId) {
    throw new AppError(POST_ERRORS.UNAUTHORIZED, 403);
  }
}
