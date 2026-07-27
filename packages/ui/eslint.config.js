import { defineConfig, globalIgnores } from 'eslint/config';
import { baseConfig, reactConfig } from '../../eslint.config.js';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...baseConfig, ...reactConfig],
  },
]);
