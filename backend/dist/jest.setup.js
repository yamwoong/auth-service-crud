"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jest" />
require("reflect-metadata");
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongod;
/**
 * Runs before all tests: starts the in-memory MongoDB and connects Mongoose.
 */
beforeAll(async () => {
    mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose_1.default.connect(uri, { dbName: 'jest' });
});
/**
 * Runs after each test: clears all data in all collections.
 */
afterEach(async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
/**
 * Runs after all tests: disconnects Mongoose and stops MongoMemoryServer.
 */
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongod.stop();
});
