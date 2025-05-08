// src/app.ts

import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
// import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { AppError } from './errors/AppError';

const app = express();

// Parse JSON bodies
app.use(express.json());

// Serve the raw OpenAPI spec for frontend or tooling
app.use('/swagger.yaml', express.static(path.resolve(__dirname, '../swagger.yaml')));

// Load and serve Swagger UI at /api-docs
const swaggerDocument = YAML.load(path.resolve(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Public health-check endpoint
app.get('/ping', (_req, res) => {
  res.send('pong');
});

// Public user routes (no authentication)
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Apply authentication middleware for all following routes
// app.use(authMiddleware);
// app.use('/dashboard', dashboardRoutes);
// app.use('/users/me', profileRoutes);

// Handle 404 for any unmatched route
app.use((_req, _res, next) => {
  next(new AppError('Not Found', 404));
});

// Global error handler
// Catches AppError and unexpected errors, sends JSON response
app.use(errorMiddleware);

export default app;
