import { defineConfig } from 'eslint/config';
import { baseConfig } from '../../eslint.config.js';

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    extends: baseConfig,
  },
]);
