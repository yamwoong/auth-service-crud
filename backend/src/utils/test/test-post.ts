import { CreatePostDto } from '@dtos/post/create-post.dto';
import { UpdatePostDto } from '@dtos/post/update-post.dto';

/**
 * A fixed test post object for predictable create post tests.
 * Note: Does NOT include authorId; it should be set by backend (from authenticated user).
 */
export const TEST_POST: CreatePostDto = {
  title: 'Test Title',
  content: 'This is a test post content.',
};

/**
 * A fixed update DTO for predictable update post tests.
 */
export const TEST_UPDATE_POST: UpdatePostDto = {
  title: 'Updated Test Title',
  content: 'This is updated test post content.',
};
