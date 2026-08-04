# monorepo

A pnpm workspace monorepo demonstrating an internal design system consumed directly from source — no build or publish step between the library and the app that uses it.

## Structure

```
.
├── packages/
│   ├── ui/       @mono/ui    — the design system (components + design tokens)
│   └── utils/    @mono/utils — small shared utility functions
└── website/                  — a Vite + React app that consumes both packages
```

- **`packages/ui`** ([README](packages/ui/README.md)) — a component library (Button, Input, Select, Card, Badge, Avatar, Icon, Spinner, Modal, Alert, Toast) built on a token system (color scales, spacing, type, radius).
- **`packages/utils`** ([README](packages/utils/README.md)) — framework-agnostic helper functions (`add`, `clamp`, `isValidNumber`).
- **`website`** ([README](website/README.md)) — a demo app that imports both packages and renders every component in `@mono/ui` for visual/manual QA.

## Requirements

- Node.js
- pnpm `^11.17.0` (see `devEngines.packageManager` in `package.json` — if you don't have it, pnpm will offer to download the right version automatically)

## Getting started

```sh
pnpm install
pnpm dev          # starts the website dev server (Vite)
```

## Scripts (root)

| Script           | What it does                                                              |
| ---------------- | ------------------------------------------------------------------------- |
| `pnpm dev`       | Runs `website`'s dev server                                               |
| `pnpm test:all`  | Runs the test suite in every workspace package (`pnpm -r test`)           |
| `pnpm token-css` | Regenerates `packages/ui/src/tokens.css` from `packages/ui/src/tokens.ts` |

Each package also has its own scripts — see its README for details, or run `pnpm --filter <name> <script>` from the root (e.g. `pnpm --filter ui test`).

## How the workspace fits together

This repo uses [pnpm workspaces](https://pnpm.io/workspaces) (configured in `pnpm-workspace.yaml`) so that `website` depends on `@mono/ui` and `@mono/utils` via `workspace:*`. Both packages are consumed **as TypeScript source**, not as built/published artifacts — `@mono/ui`'s `exports` field in `package.json` points straight at `src/index.ts`. This means:

- No build step is needed to see a change in `packages/ui` reflected in `website` — just save and the dev server picks it up.
- `react`/`react-dom` are `peerDependencies` of `@mono/ui`, not regular dependencies — the consuming app supplies its own React, and `@mono/ui` doesn't bundle a second copy.
- There's deliberately no Turborepo, Nx, or Changesets here — with two small packages, that tooling would be ceremony without payoff. If the workspace grows significantly, that's worth reconsidering.

## Design tokens

`@mono/ui`'s design tokens (`packages/ui/src/tokens.ts`) are the single source of truth for colors, spacing, type, and radius. They're consumed three ways from the same data:

1. Directly in TypeScript (`tokens`, `flatTokens`) for anything that needs the raw values.
2. As CSS custom properties (`packages/ui/src/tokens.css`, regenerated via `pnpm token-css`) — component CSS reads spacing, color, typography, and radii from these variables. Raw values are still fine for layout mechanics (percentages, viewport units, `fr`, `flex`, container max-widths, 1px borders).
3. Any consuming app imports `@mono/ui/tokens.css` once (see `website/src/App.tsx`) to get the CSS variables on `:root`.
