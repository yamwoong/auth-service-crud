export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  USER_NOT_FOUND: 'User not found',
  INVALID_CURRENT_PASSWORD: 'Current password is incorrect',
  NO_REFRESH_TOKEN_PROVIDED: 'No refresh token provided',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
};

export const COMMON_ERRORS = {
  VALIDATION_FAILED: 'Validation failed',
  INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
};

export const POST_ERRORS = {
  INVALID_POST_ID: 'Invalid post ID',
  POST_NOT_FOUND: 'Post not found',
  UNAUTHORIZED: 'You do not have permission to perform this action on the post',
  INVALID_TITLE: 'Title must be at least 3 characters',
  NO_UPDATE_FIELDS: 'At least one field must be provided for update',
  DUPLICATE_TITLE: 'A post with this title already exists',
};
