import { CreatePostDto } from '@dtos/post/create-post.dto';
import { UpdatePostDto } from '@dtos/post/update-post.dto';

/**
 * A fixed test post object for predictable tests
 */
export const TEST_POST: CreatePostDto = {
  title: 'Test Title',
  content: 'This is a test post content.',
  authorId: '682f3641b6246ad982115d5e',
};

/**
 * A fixed update DTO for predictable update tests
 */
export const TEST_UPDATE_POST: UpdatePostDto = {
  title: 'Updated Test Title',
  content: 'This is updated test post content.',
};
