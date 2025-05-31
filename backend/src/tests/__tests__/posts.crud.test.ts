import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Application } from 'express';
import { PostModel } from '@models/post.model';
import { createDummyPost, createDummyUpdatePost } from '@test-utils/createDummyPost';

let server: Application;

describe('Posts API CRUD (In-Memory MongoDB)', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start an in-memory MongoDB instance for isolated testing
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Override environment variables so the app connects to the in-memory database
    process.env.MONGO_URI = uri;
    process.env.DB_NAME = 'testdb';

    // Import the app after environment variables are set (so the app uses the test DB)
    const { default: app } = await import('../../app');
    server = app as Application;
  });

  afterAll(async () => {
    // Disconnect Mongoose and stop the in-memory MongoDB server after all tests
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections before each test to ensure test isolation
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it('should create a post - POST /api/posts', async () => {
    // Create dummy post data (without authorId)
    const dummy = createDummyPost();

    // Send a request to create a new post (no authorId in payload)
    const res = await request(server).post('/api/posts').send(dummy).expect(201);

    // Response should contain the same title and content
    expect(res.body).toMatchObject({
      title: dummy.title,
      content: dummy.content,
      // authorId is set by the backend (usually from authentication)
    });

    // The post should actually exist in the database
    const saved = await PostModel.findById(res.body.id).lean();
    expect(saved).not.toBeNull();
    expect(saved).toMatchObject({
      title: dummy.title,
      content: dummy.content,
      // authorId is not asserted here since it's assigned by backend logic
    });
  });

  it('should retrieve all posts - GET /api/posts', async () => {
    // Directly insert a post into the database with authorId (required by schema)
    const dummy = { ...createDummyPost(), authorId: new mongoose.Types.ObjectId() };
    const doc = await new PostModel(dummy).save();

    // Request all posts
    const res = await request(server).get('/api/posts').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);

    // Response should match the document saved in the database
    expect(res.body[0]).toMatchObject({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      authorId: doc.authorId.toString(),
    });
  });

  it('should retrieve a single post - GET /api/posts/:id', async () => {
    // Insert a post directly into the database
    const dummy = { ...createDummyPost(), authorId: new mongoose.Types.ObjectId() };
    const doc = await new PostModel(dummy).save();

    // Request the post by ID
    const res = await request(server).get(`/api/posts/${doc.id}`).expect(200);

    expect(res.body).toMatchObject({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      authorId: doc.authorId.toString(),
    });
  });

  it('should update a post - PATCH /api/posts/:id', async () => {
    // Insert a post for update testing
    const dummy = { ...createDummyPost(), authorId: new mongoose.Types.ObjectId() };
    const doc = await new PostModel(dummy).save();
    const updateDto = createDummyUpdatePost();

    // Send a patch request to update the post
    const res = await request(server).patch(`/api/posts/${doc.id}`).send(updateDto).expect(200);

    expect(res.body).toMatchObject({
      id: doc.id,
      title: updateDto.title,
      content: updateDto.content,
    });

    // The database should reflect the updated values
    const updated = await PostModel.findById(doc.id).lean();
    expect(updated).toMatchObject({
      title: updateDto.title,
      content: updateDto.content,
    });
  });

  it('should delete a post - DELETE /api/posts/:id', async () => {
    // Insert a post for deletion testing
    const dummy = { ...createDummyPost(), authorId: new mongoose.Types.ObjectId() };
    const doc = await new PostModel(dummy).save();

    // Send a delete request
    await request(server).delete(`/api/posts/${doc.id}`).expect(204);

    // The post should no longer exist in the database
    const found = await PostModel.findById(doc.id);
    expect(found).toBeNull();
  });
});
