import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

/**
 * Connect to MongoDB using Mongoose.
 */
export const connectToMongo = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(env.mongoUri, {
      dbName: getDbNameFromUri(env.mongoUri),
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB.
 */
export const disconnectFromMongo = async () => {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error during MongoDB disconnection:', error);
  }
};

/**
 * Extract DB name from URI for dbName option (optional).
 */
const getDbNameFromUri = (uri: string): string => {
  const dbName = uri.split('/').pop()?.split('?')[0];
  return dbName || 'test';
};
