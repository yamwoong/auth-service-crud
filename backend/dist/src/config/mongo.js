"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromMongo = exports.connectToMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
let isConnected = false;
/**
 * Connect to MongoDB using Mongoose.
 */
const connectToMongo = async () => {
    if (isConnected) {
        console.log('Already connected to MongoDB');
        return;
    }
    try {
        await mongoose_1.default.connect(env_1.env.mongoUri, {
            dbName: getDbNameFromUri(env_1.env.mongoUri),
        });
        isConnected = true;
        console.log('MongoDB connected');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
exports.connectToMongo = connectToMongo;
/**
 * Disconnect from MongoDB.
 */
const disconnectFromMongo = async () => {
    if (!isConnected)
        return;
    try {
        await mongoose_1.default.disconnect();
        isConnected = false;
        console.log('MongoDB disconnected');
    }
    catch (error) {
        console.error('Error during MongoDB disconnection:', error);
    }
};
exports.disconnectFromMongo = disconnectFromMongo;
/**
 * Extract DB name from URI for dbName option (optional).
 */
const getDbNameFromUri = (uri) => {
    const dbName = uri.split('/').pop()?.split('?')[0];
    return dbName || 'test';
};
