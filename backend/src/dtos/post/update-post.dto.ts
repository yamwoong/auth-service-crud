/**
 * DTO for updating an existing Post.
 * Defines the properties accepted in the request body of PUT /api/posts/:id.
 */
export interface UpdatePostDto {
  title?: string; // (optional) new title for the post
  content?: string; // (optional) new content/body of the post
}
