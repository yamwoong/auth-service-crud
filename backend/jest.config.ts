/// <reference types="node" />

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',

  testMatch: ['**/*.test.ts'],

  setupFiles: ['../jest.reflect.ts'],
  setupFilesAfterEnv: ['../jest.setup.ts'],

  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@errors/(.*)$': '<rootDir>/errors/$1',
    '^@dtos/(.*)$': '<rootDir>/dtos/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@test-utils/(.*)$': '<rootDir>/utils/test/$1',
  },

  collectCoverage: true,
  coverageDirectory: '../coverage',
};

export default config;
