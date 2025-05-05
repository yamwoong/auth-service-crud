/// <reference types="jest" />
import 'reflect-metadata';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

/**
 * Runs before all tests: starts the in-memory MongoDB and connects Mongoose.
 */

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { dbName: 'jest' });
});

/**
 * Runs after each test: clears all data in all collections.
 */

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

/**
 * Runs after all tests: disconnects Mongoose and stops MongoMemoryServer.
 */

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
