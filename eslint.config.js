import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

// Reusable rule fragments (no `files` of their own) — whichever block
// spreads these in supplies the `files` scope, so packages can reuse them
// with base-relative globs regardless of where they live in the workspace.
export const baseConfig = [js.configs.recommended, tseslint.configs.recommended];

export const reactConfig = [
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  { languageOptions: { globals: globals.browser } },
];

// The whole-repo config, used when running eslint from the monorepo root.
// Directory-scoped so React rules only apply to the two React packages.
export default defineConfig([
  globalIgnores(['**/dist/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: baseConfig,
  },
  {
    files: ['packages/ui/**/*.{ts,tsx}', 'website/**/*.{ts,tsx}'],
    extends: reactConfig,
  },
]);
