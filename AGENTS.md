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

- Never edit `packages/ui/src/tokens.css`, `packages/ui/generated/tokens.json`, or `packages/ui/generated/components.json`. The first two are generated from `tokens.ts`; the third is generated from component/hook source. All three are CI-diffed — a stale commit of any of them fails the build. Run `pnpm run tokens` to regenerate.
- New UI primitives go in `packages/ui`, never in `website/`.
- Don't add dependencies without asking.

## MCP Tools

- `.mcp.json` configures MCP servers exposing tools, resources, and prompts for this repo (currently `ds`, which serves the `packages/ui` design system to agents — see `packages/ds-mcp`). Before defaulting to raw file reads/greps, check whether an available MCP tool, resource, or prompt already covers the task, and prefer it when it applies. `packages/ui/AGENTS.md` requires this when modifying components; `website/AGENTS.md` intentionally opts out of it for view-authoring — see that file for why.

## Dev environment tips

- Use `pnpm --filter website dev` to run the "website" app locally
- Use `pnpm run tokens` to regenerate `tokens.css` and `generated/tokens.json` after editing `tokens.ts` — it also regenerates `generated/components.json` from component/hook source as part of the same build

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
