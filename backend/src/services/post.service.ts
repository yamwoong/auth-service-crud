import { Service } from 'typedi';
import { BaseService } from '@services/base.service';
import { PostRepository } from '@repositories/post.repository';
import { AppError } from '@errors/AppError';
import { POST_ERRORS } from '@constants/errors';
import type { PostDocument } from '@models/post.model';
import type { CreatePostDto } from '@dtos/post/create-post.dto';
import type { UpdatePostDto } from '@dtos/post/update-post.dto';

@Service()
export class PostService extends BaseService<PostDocument, CreatePostDto, UpdatePostDto> {
  /**
   * Inject the concrete PostRepository instance.
   * @param repository - The PostRepository wired by TypeDI
   */
  constructor(protected repository: PostRepository) {
    super(repository);
  }

  /**
   * Create a new post with business‐rule validation.
   * @param data - DTO carrying title, content, authorId
   * @throws {AppError} 400 if title is too short
   * @throws {AppError} 409 if a post with the same title already exists
   * @returns The created PostDocument
   */
  async create(data: CreatePostDto): Promise<PostDocument> {
    // 1) Title length validation
    if (data.title.length < 3) {
      throw new AppError(POST_ERRORS.INVALID_TITLE, 400);
    }

    // 2) Unique‐title rule
    const exists = await this.repository.findByTitle(data.title);
    if (exists) {
      throw new AppError(POST_ERRORS.DUPLICATE_TITLE, 409);
    }

    // 3) Delegate to BaseService#create for persistence
    return super.create(data);
  }

  /**
   * Retrieve all posts.
   * @returns Array of PostDocument
   */
  async findAll(): Promise<PostDocument[]> {
    return super.findAll();
  }

  /**
   * Retrieve a single post by ID or throw if not found.
   * @param id - String ID of the post
   * @throws {AppError} 404 if no post with given ID
   * @returns The found PostDocument
   */
  async findByIdOrFail(id: string): Promise<PostDocument> {
    return super.findByIdOrFail(id);
  }

  /**
   * Update an existing post.
   * @param id - String ID of the post to update
   * @param data - DTO carrying update fields
   * @throws {AppError} 400 if no update fields provided
   * @returns The updated PostDocument
   */
  async update(id: string, data: UpdatePostDto): Promise<PostDocument> {
    if (Object.keys(data).length === 0) {
      throw new AppError(POST_ERRORS.NO_UPDATE_FIELDS, 400);
    }
    return super.update(id, data);
  }

  /**
   * Delete a post by its ID.
   * @param id - String ID of the post to delete
   * @returns void
   */
  async delete(id: string): Promise<void> {
    await super.delete(id);
  }

  /**
   * Find one post by exact title or fail with error.
   * @param title - Exact title to search for
   * @throws {AppError} 404 if no post found
   * @returns The found PostDocument
   */
  async findByTitleOrFail(title: string): Promise<PostDocument> {
    const post = await this.repository.findByTitle(title);
    if (!post) {
      throw new AppError(POST_ERRORS.POST_NOT_FOUND, 404);
    }
    return post;
  }
}
