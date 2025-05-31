/**
 * DTO for creating a new Post.
 * Defines the properties expected in the request body of POST /api/posts.
 */

export interface CreatePostDto {
  title: string; // Title of the post
  content: string; // Main content/body of the post
}
