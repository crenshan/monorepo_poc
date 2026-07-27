# @mono/utils

Small, framework-agnostic utility functions shared across the [monorepo](../../README.md). One function per file, each with its own test.

## What's here

| Function | Signature | Notes |
| --- | --- | --- |
| `add` | `(a: number, b: number) => number` | |
| `clamp` | `(value: number, min: number, max: number) => number` | Restricts `value` to the `[min, max]` range |
| `isValidNumber` | `(value: string) => boolean` | `true` for a non-empty string that parses to a finite number |

```ts
import { add, clamp, isValidNumber } from '@mono/utils'
```

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm test` | Runs the Vitest suite (`vitest run`) |

## Adding a new utility

Add `name.ts` + `name.test.ts` at `src/`, then add `export * from './name'` to `src/index.ts`. Keep functions small, pure, and dependency-free — this package exists for logic that has no business depending on React or any other package in the workspace.
