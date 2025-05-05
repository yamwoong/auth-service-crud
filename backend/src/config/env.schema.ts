import Joi from 'joi';

/**
 * Define and validate application environment variables.
 */

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required()
    .description('Node.js environment (development, production, test)'), // Execution mode of the application

  PORT: Joi.number()
    .port()
    .required()
    .description('Server listening port'), // Port number on which the server listens

  MONGODB_URI: Joi.string()
    .uri()
    .required()
    .description('MongoDB connection URI'), // Connection URI for MongoDB

  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT secret key (minimum 32 characters)'), // Secret key for signing JWTs (at least 32 characters)

  REDIS_URL: Joi.string()
    .uri()
    .optional()
    .allow('')
    .description('Redis URL (optional)') // Connection URL for Redis (optional)
}).unknown(true)   // Ignore environment variables not defined in this schema
  .required();     // Require the presence of this entire schema object