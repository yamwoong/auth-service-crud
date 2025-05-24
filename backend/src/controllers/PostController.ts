import {
  JsonController,
  Get,
  Post as PostMethod,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  OnUndefined,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { PostService } from '@services/post.service';
import type { CreatePostDto } from '@dtos/post/create-post.dto';
import type { UpdatePostDto } from '@dtos/post/update-post.dto';

import { mapMongoPostToPost, mapMongoPostsToPosts } from '@mappers/post.mapper';
import type { Post } from '@shared-types/post';

@JsonController('/posts')
@Service()
export class PostController {
  constructor(
    @Inject()
    private readonly postService: PostService
  ) {}

  /**
   * Get all posts.
   * GET /posts
   */
  @Get()
  @HttpCode(200)
  async getAll() {
    const docs = await this.postService.findAll();
    return mapMongoPostsToPosts(docs);
  }

  /**
   * Get a post by ID.
   * GET /posts/:id
   * @param id - Post ID
   */
  @Get('/:id')
  @HttpCode(200)
  async getById(@Param('id') id: string) {
    const doc = await this.postService.findByIdOrFail(id);
    return mapMongoPostToPost(doc);
  }

  /**
   * Create a new post.
   * POST /posts
   * @param body - CreatePostDto
   */
  @PostMethod()
  @HttpCode(201)
  async create(@Body() body: CreatePostDto) {
    const doc = await this.postService.create(body);
    return mapMongoPostToPost(doc);
  }

  /**
   * Update a post by ID.
   * PATCH /posts/:id
   * @param id - Post ID
   * @param body - UpdatePostDto
   */
  @Patch('/:id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    const doc = await this.postService.update(id, body);
    return mapMongoPostToPost(doc);
  }

  /**
   * Delete a post by ID.
   * DELETE /posts/:id
   * @param id - Post ID
   */
  @Delete('/:id')
  @HttpCode(204)
  @OnUndefined(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.postService.delete(id);
  }
}
