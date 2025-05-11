import dotenv from 'dotenv';
import { envSchema } from '@config/env.schema';

dotenv.config();

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

  googleClientId: envVars.GOOGLE_CLIENT_ID,
  googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: envVars.GOOGLE_CALLBACK_URL,

  gmailClientId: envVars.GMAIL_CLIENT_ID,
  gmailClientSecret: envVars.GMAIL_CLIENT_SECRET,
  gmailRefreshToken: envVars.GMAIL_REFRESH_TOKEN,
  gmailUser: envVars.GMAIL_USER,
  resetPasswordUrl: envVars.RESET_PASSWORD_URL,
};
