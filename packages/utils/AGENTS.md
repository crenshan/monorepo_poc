# Utils

Shared framework-agnostic utilities consumed by apps and other packages in the monorepo.

## Package Structure

```txt
 .
└── src/               — all utilities and their tests
    ├── example.ts        — utility code
    ├── example.test.ts   — test code for utility
    └── index.ts          — barrel export file for all utilities
```

## Hard Boundaries

- No React, no DOM APIs, no component code. This package must stay framework-agnostic.
- Pure functions only — no module-level state or side effects.
- Every utility ships with tests.
- Export from the barrel `src/index.ts`.
