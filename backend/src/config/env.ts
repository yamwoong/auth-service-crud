import dotenv from 'dotenv-safe';
import { envSchema } from './env.schema';

dotenv.config({
  allowEmptyValues: true,
});

const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

export const env = {
  nodeEnv: envVars.NODE_ENV,
  port: Number(envVars.PORT),
  mongoUri: envVars.MONGODB_URI,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  refreshSecret: envVars.JWT_REFRESH_SECRET,
  refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  redisUrl: envVars.REDIS_URL || '',
};
