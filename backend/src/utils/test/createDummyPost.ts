import { CreatePostDto } from '@dtos/post/create-post.dto';

/**
 * Returns dummy post data for creating a new post.
 * You can override fields by passing an object as the argument.
 * Note: authorId is not included, since it should be set by the backend (authenticated user).
 */
export function createDummyPost(overrides?: Partial<CreatePostDto>) {
  return {
    title: 'Test Title',
    content: 'Test Content',
    ...overrides, // Allows for field overrides if needed
  };
}

/**
 * Returns dummy data for updating a post.
 * You can override fields by passing an object as the argument.
 */
export function createDummyUpdatePost(overrides?: Partial<CreatePostDto>) {
  return {
    title: 'Updated Title',
    content: 'Updated Content',
    ...overrides,
  };
}
