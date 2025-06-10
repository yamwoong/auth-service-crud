"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../../app"));
const createDummyPost_1 = require("../../utils/test/createDummyPost");
const test_post_1 = require("../../utils/test/test-post");
describe('Posts API CRUD (In-Memory DB)', () => {
    let mongod;
    let postId;
    beforeAll(async () => {
        mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongod.getUri(), { dbName: 'jest' });
    });
    afterEach(async () => {
        for (const col of Object.values(mongoose_1.default.connection.collections)) {
            await col.deleteMany({});
        }
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongod.stop();
    });
    it('POST /api/posts → 201 Created', async () => {
        // Create a dummy post DTO (without authorId)
        const dto = (0, createDummyPost_1.createDummyPost)();
        const res = await (0, supertest_1.default)(app_1.default).post('/api/posts').send(dto).expect(201);
        expect(res.body).toMatchObject({
            title: dto.title,
            content: dto.content,
            // authorId is not checked here since it's assigned by backend
        });
        postId = res.body.id;
    });
    it('GET /api/posts → 200 OK & array', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/posts').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
    it('GET /api/posts/:id → 200 OK', async () => {
        await (0, supertest_1.default)(app_1.default).get(`/api/posts/${postId}`).expect(200);
    });
    it('PATCH /api/posts/:id → 200 OK', async () => {
        // Use fixed update DTO (no authorId)
        const updateDto = test_post_1.TEST_UPDATE_POST;
        const res = await (0, supertest_1.default)(app_1.default).patch(`/api/posts/${postId}`).send(updateDto).expect(200);
        expect(res.body.title).toBe(updateDto.title);
        expect(res.body.content).toBe(updateDto.content);
    });
    it('DELETE /api/posts/:id → 204 No Content', async () => {
        await (0, supertest_1.default)(app_1.default).delete(`/api/posts/${postId}`).expect(204);
    });
});
