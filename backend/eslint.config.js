import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // ESLint 기본 룰 (JS용)
  js.configs.recommended,

  // TypeScript 전용 설정
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json', // ✅ 여기를 backend 기준으로 변경
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
      globals: {
        console: true,
        process: true,
        module: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Jest 테스트 파일 설정 (테스트 전역 변수 허용)
  {
    files: ['**/__tests__/**/*.ts', '**/*.test.ts'],
    languageOptions: {
      globals: {
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        test: true,
        process: true,
      },
    },
  },

  // 설정 파일 등 타입 체크 없는 파일 (별도 처리)
  {
    files: ['jest.config.ts', 'eslint.config.js'],
    languageOptions: {
      parser,
      parserOptions: {
        sourceType: 'module',
      },
      globals: {
        process: true,
        module: true,
      },
    },
  },
];
