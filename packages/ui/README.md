# @mono/ui

An internal design system: a small set of React components built on a shared design-token system. Part of the [monorepo](../../README.md) — consumed by `website` directly from source, no build step required.

## Components

| Component                              | Notes                                                                                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `Button`                               | Standard button, disabled state                                                                 |
| `Input`                                | Labeled text input with error/`aria-invalid` support                                            |
| `Select`                               | Labeled native `<select>` with the same label/error contract as `Input`                         |
| `Card`                                 | Bordered surface for grouping content                                                           |
| `Badge`                                | Small status pill — `neutral` / `primary` / `success` / `warning` / `danger`                    |
| `Avatar`                               | Image with initials fallback, 4 sizes                                                           |
| `Icon`                                 | Small inline SVG icon set (`check`, `x`, `chevronDown`, `alertCircle`, `spinner`)               |
| `Spinner`                              | Loading indicator built on `Icon`, announces via `role="status"`                                |
| `Modal`                                | Dialog rendered via `createPortal`, focus trap + restore, closes on Escape/overlay/close button |
| `Alert`                                | Inline status banner, same variant colors as `Badge`, optional dismiss button                   |
| `Toast` + `ToastProvider` / `useToast` | Auto-dismissing notifications, composes `Alert`, rendered in a portal                           |

All components are exported from the package root:

```tsx
import { Button, Input, Modal, useToast } from '@mono/ui';
import '@mono/ui/tokens.css';
```

## Design tokens

`src/tokens.ts` is the single source of truth for colors (full `red`/`blue`/`green`/`amber`/`gray` 100–900 scales, plus semantic aliases like `primary`/`danger`/`text`), spacing, font size/weight, and radius. Every component's CSS reads exclusively from these — no raw hex or px values.

- `pnpm token-css` regenerates `src/tokens.css` (a `:root` block of CSS custom properties) from `tokens.ts`. Run it after changing `tokens.ts`.
- Consumers import `@mono/ui/tokens.css` once, at the app root, to get the variables.

## Styling convention

Every component has a co-located `Component.module.css`. Components import it as `import styles from './Component.module.css'` and apply classes via `styles['class-name']` — real CSS Modules scoping, not literal class strings. (Vite hashes `.module.css` class names regardless of import style, so referencing the generated `styles` object is required for the CSS to actually apply — a literal `className="ds-button"` string will not match the hashed selector Vite injects.) Tests that assert on class names import the same `.module.css` file and compare against `styles['class-name']` rather than a hardcoded string, for the same reason.

## Scripts

| Script           | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Vite dev server for this package in isolation     |
| `pnpm test`      | Runs the Vitest suite (`vitest run`)              |
| `pnpm token-css` | Regenerates `src/tokens.css` from `src/tokens.ts` |
| `pnpm build`     | Regenerates tokens, typechecks, and builds        |
| `pnpm lint`      | ESLint                                            |

## Testing

Every component has a co-located `Component.test.tsx` using Vitest + React Testing Library — rendering, prop forwarding, accessibility attributes (labels, `aria-*`, roles), and interaction behavior (clicks, keyboard, auto-dismiss timers via fake timers for `Toast`).

## Adding a new component

Follow the existing folder shape: `src/components/Name/Name.tsx`, `Name.module.css`, `Name.test.tsx`, `index.ts` (re-exports `Name`), then add `export * from './Name'` to `src/components/index.ts`. Keep all CSS values token-driven, and give interactive/stateful components the same label/error or role/focus treatment as the closest existing component (e.g. new form fields should match `Input`'s label + error pattern).
