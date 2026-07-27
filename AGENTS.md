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
