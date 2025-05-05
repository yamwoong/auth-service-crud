import 'reflect-metadata';
import app from './app';
import { env } from './config';
import { connectToMongo } from './config/mongo';

const startServer = async () => {
  try {
    await connectToMongo();
    app.listen(env.port, () => {
      console.log(`[server] Server is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
