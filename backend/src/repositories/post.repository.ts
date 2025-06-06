import { Service } from 'typedi';
import { PostModel, PostDocument } from '@models/post.model';
import type { CreatePostDto } from '@dtos/post/create-post.dto';
import type { UpdatePostDto } from '@dtos/post/update-post.dto';
import { BaseRepository } from '@repositories/base.repository';
import { POST_ERRORS } from '@constants/errors';

/**
 * Repository responsible for all Post-related database operations.
 * Extends BaseRepository to reuse common ObjectId and existence check logic.
 */
@Service()
export class PostRepository extends BaseRepository<PostDocument, CreatePostDto, UpdatePostDto> {
  /**
   * Error to throw when an invalid post ID is provided.
   */
  protected invalidIdError = POST_ERRORS.INVALID_POST_ID;

  /**
   * Error to throw when a post is not found.
   */
  protected notFoundError = POST_ERRORS.POST_NOT_FOUND;

  /**
   * Find a post by its title.
   * @param title - The exact title to search for
   * @returns Promise resolving to the found PostDocument or null if none
   */
  async findByTitle(title: string): Promise<PostDocument | null> {
    return PostModel.findOne({ title }).exec();
  }

  /**
   * Creates a new post.
   * NOTE: This does NOT match the BaseRepository signature and should be renamed to createWithAuthor in practice.
   * @param data - DTO containing the post data (title, content)
   * @param authorId - The ObjectId string of the post author (from authenticated user)
   * @returns Promise resolving to the created PostDocument
   */

  async createWithAuthor(data: CreatePostDto, authorId: string): Promise<PostDocument> {
    const authorObjId = this.toObjectId(authorId);

    return PostModel.create({
      title: data.title,
      content: data.content,
      authorId: authorObjId,
    });
  }

  /**
   * Implements BaseRepository create method.
   * Only use for testing, seeding, or when authorId is included in data.
   * @param data - DTO containing all fields for a post, including authorId
   * @returns Promise resolving to the created PostDocument
   */
  async create(data: CreatePostDto): Promise<PostDocument> {
    return PostModel.create(data);
  }

  /**
   * Retrieves all Post documents.
   * @returns Promise resolving to an array of PostDocument
   */
  async findAll(): Promise<PostDocument[]> {
    return PostModel.find().exec();
  }

  /**
   * Finds a Post by its string ID or throws if not found.
   * @param id - The string representation of the post ID
   * @returns Promise resolving to the found PostDocument
   */
  async findByIdOrFail(id: string): Promise<PostDocument> {
    const objectId = this.toObjectId(id);
    const post = await PostModel.findById(objectId).exec();
    return this.ensureFound(post);
  }

  /**
   * Updates a Post by its ID.
   * @param id - The string representation of the post ID
   * @param data - DTO containing the fields to update
   * @returns Promise resolving to the updated PostDocument
   */
  async update(id: string, data: UpdatePostDto): Promise<PostDocument> {
    const objectId = this.toObjectId(id);
    const updated = await PostModel.findByIdAndUpdate(
      objectId,
      { $set: data },
      { new: true }
    ).exec();
    return this.ensureFound(updated);
  }

  /**
   * Deletes a Post by its ID.
   * @param id - The string representation of the post ID
   * @returns Promise that resolves when deletion is complete
   */
  async delete(id: string): Promise<void> {
    const objectId = this.toObjectId(id);
    const deleted = await PostModel.findByIdAndDelete(objectId).exec();
    this.ensureFound(deleted);
  }
}
