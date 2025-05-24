// src/types/post.ts

/**
 * Plain object representing a post in API responses.
 * This is the mapped version of a Mongoose PostDocument.
 */
export interface Post {
  id: string; // mapped from _id
  title: string;
  content: string;
  authorId: string; // ObjectId → string
  createdAt: Date;
  updatedAt: Date;
}
