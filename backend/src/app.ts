import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@config/swagger';
import userRoutes from '@routes/user.route';
import authRoutes from '@routes/auth.route';
import dashboardRoutes from '@routes/dashboard.route';
import { authMiddleware } from '@middlewares/auth.middleware';
import { errorMiddleware } from '@middlewares/error.middleware';
import { AppError } from '@errors/AppError';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173', // Vite 개발 서버
      'http://localhost:8080', // Docker Nginx 프론트
    ],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

app.use(cookieParser());

// Serve the raw OpenAPI spec for frontend or tooling
app.use('/swagger.yaml', express.static(path.resolve(process.cwd(), 'swagger.yaml')));

// Load and serve Swagger UI at /api-docs
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: { docExpansion: 'none' },
  })
);

// Public health-check endpoint
app.get('/ping', (_req, res) => {
  res.send('pong');
});

// Public user routes (no authentication)
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Apply authentication middleware for all following routes
app.use(authMiddleware);
app.use('/dashboard', dashboardRoutes);
// app.use('/users/me', profileRoutes);

// Handle 404 for any unmatched route
app.use((_req, _res, next) => {
  next(new AppError('Not Found', 404));
});

// Global error handler
// Catches AppError and unexpected errors, sends JSON response
app.use(errorMiddleware);

export default app;
