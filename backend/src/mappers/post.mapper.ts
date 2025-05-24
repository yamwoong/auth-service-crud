// src/mappers/post.mapper.ts

import { PostDocument } from '@models/post.model';
import { Post } from '@shared-types/post';

/**
 * Converts a Mongoose PostDocument to a plain Post object
 * suitable for API responses.
 *
 * @param doc - Mongoose document representing a Post
 * @returns Post - plain object matching the Post type
 */
export function mapMongoPostToPost(doc: PostDocument): Post {
  const obj = doc.toObject();

  return {
    id: obj._id.toString(),
    title: obj.title,
    content: obj.content,
    authorId: obj.authorId.toString(),
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

/**
 * Helper to map an array of PostDocument to an array of Post
 *
 * @param docs - array of Mongoose PostDocument
 * @returns Post[] - array of plain Post objects
 */
export function mapMongoPostsToPosts(docs: PostDocument[]): Post[] {
  return docs.map(mapMongoPostToPost);
}
