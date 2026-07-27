# POC Monorepo

Proof of Concept illustrating the use of a monorepo for a central application as well as a UI library and Utility library available as dependencies.

## Monorepo Structure

```txt
.
├── packages/
│ ├── ui/       — shared design system (components + tokens)
│ └── utils/    — shared utilities
└── website/    — the consuming app
```

## Hard Boundaries

- Never edit `packages/ui/src/tokens.css`. It's generated from `tokens.ts`, which is the single source of truth. After editing tokens, run `pnpm run token-css`.
- New UI primitives go in `packages/ui`, never in `website/`.
- Don't add dependencies without asking.

## Dev environment tips

- Use `pnpm --filter website dev` to run the "website" app locally
- Use `pnpm run token-css` to regenerate the `tokens.css` after editing `tokens.ts`

## Testing instructions

- Use `pnpm run test:all` to run the test suites for all apps and packages in the repo.
- Use `pnpm --filter {package} test` to test individual packages or apps.

## Linting & formatting

- Use `pnpm lint` to lint JS/TS across all packages; `pnpm lint:fix` to auto-fix.
- Use `pnpm lint:css` to lint CSS across the repo with Stylelint; `pnpm lint:css:fix` to auto-fix.
- Use `pnpm format` to format the repo with Prettier; `pnpm format:check` to check formatting without writing.
- Use `pnpm typecheck` to typecheck all packages (each package's own `tsc -b --noEmit` / `tsc --noEmit`).
- Shared configs live at the repo root (`eslint.config.js`, `tsconfig.base.json`, `.stylelintrc.json`, `.prettierrc.json`) and are composed/extended by each package — don't duplicate rules locally.
- A Husky pre-commit hook runs `lint-staged` (`.lintstagedrc.json`) automatically on every commit — it runs ESLint/Stylelint `--fix` and Prettier on staged files and blocks the commit if a fix leaves real errors (e.g. unused vars). Typecheck and tests are not part of the hook and must still be run manually/in CI.
