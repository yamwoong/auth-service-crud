/** @type {import('lint-staged').Config} */
const config = {
  '**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
};

export default config;
