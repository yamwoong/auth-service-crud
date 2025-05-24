import { Types } from 'mongoose';
import { AppError } from '@errors/AppError';

/**
 * Abstract base class for all repositories.
 * Defines common helper methods and a CRUD interface for subclasses.
 * @template TDocument - The type of document managed by the repository
 * @template TCreateDto - The DTO type used for creating documents
 * @template TUpdateDto - The DTO type used for updating documents
 */
export abstract class BaseRepository<TDocument, TCreateDto, TUpdateDto> {
  /**
   * Error message to use when an invalid ID is provided.
   * Must be overridden by subclasses with a domain-specific message.
   */
  protected abstract invalidIdError: string;

  /**
   * Error message to use when a document is not found.
   * Must be overridden by subclasses with a domain-specific message.
   */
  protected abstract notFoundError: string;

  /**
   * Convert a string to a MongoDB ObjectId, throwing an error if invalid.
   * @param id - The string representation of an ObjectId
   * @returns A valid Types.ObjectId
   * @throws AppError with status 400 if the id is invalid
   */
  protected toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(this.invalidIdError, 400);
    }
    return new Types.ObjectId(id);
  }

  /**
   * Ensure that a queried document exists; throw an error if not.
   * @param doc - The result of a database query, which may be null or undefined
   * @returns The document if it exists
   * @throws AppError with status 404 if the document is null or undefined
   */
  protected ensureFound<U>(doc: U | null | undefined): U {
    if (!doc) {
      throw new AppError(this.notFoundError, 404);
    }
    return doc;
  }

  /**
   * Create a new document.
   * @param data - The data transfer object containing creation properties
   * @returns A promise that resolves to the created document
   */
  abstract create(data: TCreateDto): Promise<TDocument>;

  /**
   * Retrieve all documents.
   * @returns A promise that resolves to an array of documents
   */
  abstract findAll(): Promise<TDocument[]>;

  /**
   * Find a single document by ID or throw if not found.
   * @param id - The string representation of the document ID
   * @returns A promise that resolves to the found document
   */
  abstract findByIdOrFail(id: string): Promise<TDocument>;

  /**
   * Update a document by ID.
   * @param id - The string representation of the document ID
   * @param data - The data transfer object containing update properties
   * @returns A promise that resolves to the updated document
   */
  abstract update(id: string, data: TUpdateDto): Promise<TDocument>;

  /**
   * Delete a document by ID.
   * @param id - The string representation of the document ID
   * @returns A promise that resolves when deletion is complete
   */
  abstract delete(id: string): Promise<void>;
}
