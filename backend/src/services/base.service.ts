import { BaseRepository } from '@repositories/base.repository';

/**
 * Abstract base class for all services.
 * Orchestrates common CRUD operations by delegating to a repository.
 * @template TDocument - The document type managed by the service
 * @template TCreateDto - The DTO type for creation
 * @template TUpdateDto - The DTO type for updates
 */
export abstract class BaseService<TDocument, TCreateDto, TUpdateDto> {
  /**
   * Repository instance responsible for performing data operations.
   */
  protected repository: BaseRepository<TDocument, TCreateDto, TUpdateDto>;

  /**
   * Initialize the service with a specific repository.
   * @param repository - Concrete repository implementing the CRUD contract
   */
  constructor(repository: BaseRepository<TDocument, TCreateDto, TUpdateDto>) {
    this.repository = repository;
  }

  /**
   * Create a new document.
   * @param data - DTO containing creation data
   * @returns Promise resolving to the created document
   */
  async create(data: TCreateDto): Promise<TDocument> {
    return this.repository.create(data);
  }

  /**
   * Retrieve all documents.
   * @returns Promise resolving to an array of documents
   */
  async findAll(): Promise<TDocument[]> {
    return this.repository.findAll();
  }

  /**
   * Retrieve a single document by its ID or throw if not found.
   * @param id - String representation of the document ID
   * @returns Promise resolving to the found document
   */
  async findByIdOrFail(id: string): Promise<TDocument> {
    return this.repository.findByIdOrFail(id);
  }

  /**
   * Update an existing document by its ID.
   * @param id - String representation of the document ID
   * @param data - DTO containing update data
   * @returns Promise resolving to the updated document
   */
  async update(id: string, data: TUpdateDto): Promise<TDocument> {
    return this.repository.update(id, data);
  }

  /**
   * Delete a document by its ID.
   * @param id - String representation of the document ID
   * @returns Promise that resolves when deletion is complete
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
