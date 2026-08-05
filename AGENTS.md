# POC Monorepo

Proof of Concept illustrating the use of a monorepo for a central application as well as a UI library and Utility library available as dependencies.

## Monorepo Structure

```txt
.
├── packages/
│ ├── ui/       — shared design system (components + tokens)
│ ├── utils/    — shared utilities
│ └── ds-mcp/   — MCP server exposing the design system to AI agents
└── website/    — the consuming app
```

## Hard Boundaries

- Never edit `packages/ui/src/tokens.css` or `packages/ui/tokens.json`. Both are generated from `tokens.ts`, which is the single source of truth. After editing tokens, run `pnpm run tokens`.
- New UI primitives go in `packages/ui`, never in `website/`.
- Don't add dependencies without asking.

## Dev environment tips

- Use `pnpm --filter website dev` to run the "website" app locally
- Use `pnpm run tokens` to regenerate `tokens.css` and `tokens.json` after editing `tokens.ts`

## Testing instructions

- Use `pnpm run test:all` to run the test suites for all apps and packages in the repo.
- Use `pnpm --filter {package} test` to test individual packages or apps.

## Linting & formatting

- Use `pnpm lint` to lint JS/TS across all packages; `pnpm lint:fix` to auto-fix.
- Use `pnpm lint:css` to lint CSS across the repo with Stylelint; `pnpm lint:css:fix` to auto-fix.
- Use `pnpm format` to format the repo with Prettier; `pnpm format:check` to check formatting without writing.
- Use `pnpm typecheck` to typecheck all packages (each package's own `tsc -b --noEmit` / `tsc --noEmit`).
- Shared configs live at the repo root (`eslint.config.js`, `tsconfig.base.json`, `.stylelintrc.json`, `.prettierrc.json`) and are composed/extended by each package — don't duplicate rules locally.
- A Husky pre-commit hook (`.husky/pre-commit`) runs on every commit, in order: `lint-staged` (`.lintstagedrc.json`, running ESLint/Stylelint `--fix` and Prettier on staged files), then `pnpm typecheck`, then `pnpm test:all` — the commit is blocked if any step fails (e.g. a lint fix leaves real errors, a typecheck error, or a failing test).
