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
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    // Override environment for app's DB connection
    process.env.MONGO_URI = uri;
    process.env.DB_NAME = 'testdb';

    // Import app after setting env so it uses in-memory DB
    const { default: app } = await import('../../app');
    server = app as Application;
  });

  afterAll(async () => {
    // Close mongoose connection and stop in-memory server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it('should create a post - POST /api/posts', async () => {
    const dummy = createDummyPost();
    // Ensure authorId is a valid ObjectId hex string
    dummy.authorId = new mongoose.Types.ObjectId().toHexString();

    const res = await request(server).post('/api/posts').send(dummy).expect(201);

    expect(res.body).toMatchObject({
      title: dummy.title,
      content: dummy.content,
      authorId: dummy.authorId,
    });

    const saved = await PostModel.findById(res.body.id).lean();
    expect(saved).not.toBeNull();
    expect(saved).toMatchObject({
      title: dummy.title,
      content: dummy.content,
      authorId: new mongoose.Types.ObjectId(dummy.authorId),
    });
  });

  it('should retrieve all posts - GET /api/posts', async () => {
    const dummy = createDummyPost();
    dummy.authorId = new mongoose.Types.ObjectId().toHexString();
    const doc = await new PostModel(dummy).save();

    const res = await request(server).get('/api/posts').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      authorId: doc.authorId.toString(),
    });
  });

  it('should retrieve a single post - GET /api/posts/:id', async () => {
    const dummy = createDummyPost();
    dummy.authorId = new mongoose.Types.ObjectId().toHexString();
    const doc = await new PostModel(dummy).save();

    const res = await request(server).get(`/api/posts/${doc.id}`).expect(200);

    expect(res.body).toMatchObject({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      authorId: doc.authorId.toString(),
    });
  });

  it('should update a post - PATCH /api/posts/:id', async () => {
    const dummy = createDummyPost();
    dummy.authorId = new mongoose.Types.ObjectId().toHexString();
    const doc = await new PostModel(dummy).save();
    const updateDto = createDummyUpdatePost();

    const res = await request(server).patch(`/api/posts/${doc.id}`).send(updateDto).expect(200);

    expect(res.body).toMatchObject({
      id: doc.id,
      title: updateDto.title,
      content: updateDto.content,
    });

    const updated = await PostModel.findById(doc.id).lean();
    expect(updated).toMatchObject({
      title: updateDto.title,
      content: updateDto.content,
    });
  });

  it('should delete a post - DELETE /api/posts/:id', async () => {
    const dummy = createDummyPost();
    dummy.authorId = new mongoose.Types.ObjectId().toHexString();
    const doc = await new PostModel(dummy).save();

    await request(server).delete(`/api/posts/${doc.id}`).expect(204);

    const found = await PostModel.findById(doc.id);
    expect(found).toBeNull();
  });
});
