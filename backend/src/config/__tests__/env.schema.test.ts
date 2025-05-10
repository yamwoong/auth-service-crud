import { envSchema } from '@config/env.schema';

describe('Environment Schema Validation', () => {
  const ORIGINAL_ENV = process.env;

  afterEach(() => {
    // Restore the original environment after each test
    process.env = { ...ORIGINAL_ENV };
  });

  it('passes validation when all required env vars are present and valid', () => {
    process.env = {
      NODE_ENV: 'development',
      PORT: '3000',
      MONGODB_URI: 'mongodb://localhost:27017/testdb',
      JWT_SECRET: 'a'.repeat(32),
      REDIS_URL: 'redis://localhost:6379',
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
    };

    const { error } = envSchema.validate(process.env, { abortEarly: false });
    expect(error).toBeUndefined();
  });
});
