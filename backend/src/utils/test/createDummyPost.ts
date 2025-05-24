// utils/test/createDummyPost.ts
import { CreatePostDto } from '@dtos/post/create-post.dto';
import { UpdatePostDto } from '@dtos/post/update-post.dto';
import { randomUUID } from 'crypto';

/**
 * Factory function to generate a dummy CreatePostDto
 * @param overrides Optional fields to override default values
 * @returns A CreatePostDto with default or overridden values
 */
export function createDummyPost(overrides?: Partial<CreatePostDto>): CreatePostDto {
  return {
    title: overrides?.title ?? `Test Title ${Date.now()}`,
    content: overrides?.content ?? `This is test post content at ${new Date().toISOString()}`,
    authorId: overrides?.authorId ?? randomUUID(),
    ...overrides,
  };
}

/**
 * Factory function to generate a dummy UpdatePostDto
 * @param overrides Optional fields to override default values
 * @returns An UpdatePostDto with default or overridden values
 */
export function createDummyUpdatePost(overrides?: Partial<UpdatePostDto>): UpdatePostDto {
  return {
    title: overrides?.title ?? `Updated Title ${Date.now()}`,
    content:
      overrides?.content ?? `This is updated test post content at ${new Date().toISOString()}`,
    ...overrides,
  };
}
