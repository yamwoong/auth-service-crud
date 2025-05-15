"use strict";
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './src',
    testMatch: ['**/*.test.ts'],
    setupFiles: ['../jest.reflect.ts'],
    setupFilesAfterEnv: ['../jest.setup.ts'],
    moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/config/$1',
        '^@controllers/(.*)$': '<rootDir>/controllers/$1',
        '^@middlewares/(.*)$': '<rootDir>/middlewares/$1',
        '^@repositories/(.*)$': '<rootDir>/repositories/$1',
        '^@routes/(.*)$': '<rootDir>/routes/$1',
        '^@services/(.*)$': '<rootDir>/services/$1',
        '^@errors/(.*)$': '<rootDir>/errors/$1',
        '^@dtos/(.*)$': '<rootDir>/dtos/$1',
        '^@models/(.*)$': '<rootDir>/models/$1',
        '^@utils/(.*)$': '<rootDir>/utils/$1',
        '^@test-utils/(.*)$': '<rootDir>/utils/test/$1',
        '^@validations/(.*)$': '<rootDir>/validations/$1',
        '^@constants/(.*)$': '<rootDir>/constants/$1',
        '^@schemas/(.*)$': '<rootDir>/schemas/$1',
        '^@mappers/(.*)$': '<rootDir>/mappers/$1',
        '^@interfaces/(.*)$': '<rootDir>/interfaces/$1',
    },
    collectCoverage: true,
    coverageDirectory: '../coverage',
};
exports.default = config;
