import { envSchema } from '@config/env.schema';
import dotenv from 'dotenv';

dotenv.config();

describe('Environment Schema Validation', () => {
  const ORIGINAL_ENV = process.env;

  afterEach(() => {
    // Restore original environment after each test
    process.env = { ...ORIGINAL_ENV };
  });

  it('passes validation when all required env vars are present and valid', () => {
    process.env = {
      NODE_ENV: 'development',
      PORT: '3000',
      MONGODB_URI: 'mongodb://localhost:27017/testdb',
      JWT_SECRET: 'a'.repeat(32),
      REDIS_URL: 'redis://localhost:6379',

      // ✅ Google OAuth2
      GOOGLE_CLIENT_ID: 'test-google-client-id',
      GOOGLE_CLIENT_SECRET: 'test-google-client-secret',
      GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback',

      // ✅ Gmail OAuth2
      GMAIL_CLIENT_ID: 'test-gmail-client-id',
      GMAIL_CLIENT_SECRET: 'test-gmail-client-secret',
      GMAIL_REFRESH_TOKEN: 'test-refresh-token',
      GMAIL_USER: 'test@example.com',
      RESET_PASSWORD_URL: 'http://localhost:3001/reset-password',
    };

    const { error, value } = envSchema.validate(process.env, { abortEarly: false });

    expect(error).toBeUndefined();
    expect(value.NODE_ENV).toBe('development');
    expect(value.PORT).toBe(3000);
    expect(value.JWT_SECRET.length).toBeGreaterThanOrEqual(32);
  });

  it('fails validation if PORT is not a number', () => {
    process.env = {
      NODE_ENV: 'production',
      PORT: 'not-a-number',
      MONGODB_URI: 'mongodb://localhost:27017/testdb',
      JWT_SECRET: 'a'.repeat(32),

      GOOGLE_CLIENT_ID: 'test',
      GOOGLE_CLIENT_SECRET: 'test',
      GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback',
      GMAIL_CLIENT_ID: 'test',
      GMAIL_CLIENT_SECRET: 'test',
      GMAIL_REFRESH_TOKEN: 'test',
      GMAIL_USER: 'test@example.com',
      RESET_PASSWORD_URL: 'http://localhost:3001/reset-password',
    };

    const { error } = envSchema.validate(process.env, { abortEarly: false });
    expect(error).toBeDefined();

    const portError = error!.details.find((d) => d.context?.key === 'PORT');
    expect(portError).toBeDefined();
  });

  it('allows empty REDIS_URL', () => {
    process.env = {
      NODE_ENV: 'test',
      PORT: '4000',
      MONGODB_URI: 'mongodb://localhost:27017/testdb',
      JWT_SECRET: 'a'.repeat(32),
      REDIS_URL: '',

      GOOGLE_CLIENT_ID: 'test',
      GOOGLE_CLIENT_SECRET: 'test',
      GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback',
      GMAIL_CLIENT_ID: 'test',
      GMAIL_CLIENT_SECRET: 'test',
      GMAIL_REFRESH_TOKEN: 'test',
      GMAIL_USER: 'test@example.com',
      RESET_PASSWORD_URL: 'http://localhost:3001/reset-password',
    };

    const { error } = envSchema.validate(process.env, { abortEarly: false });
    expect(error).toBeUndefined();
  });
});
