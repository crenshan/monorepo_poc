# UI Library

UI library containing design tokens and components to be utilized across web apps.

## Package Structure

```txt
 .
├── scripts/                    — build tooling (tokens.css generator)
└── src/                        — components and tokens
    ├── components/                 — all components
    │   ├── Example/                   — `Example` component directory
    │   │   ├── Example.tsx              — React code for `Example`
    │   │   ├── Example.module.css       — CSS module code for `Example`
    │   │   ├── Example.test.tsx         — test code for `Example`
    │   │   └── index.ts                — export file for `Example`
    │   └── index.ts                  — export barrel file for all components
    ├── tokens.ts                    — all design system tokens (in JS object)
    └── tokens.css                   — CSS variables for design system tokens (generated)
```

## Hard Boundaries

- All CSS values use `var(--*)` tokens. Token names follow `--{group}-{key}` — read `src/tokens.ts` for the available set. Never invent names.
- New tokens are added to `tokens.ts`, then run `pnpm run token-css`.
- When building composite or more complex components, reuse smaller atomic components within this library if applicable.
- All components are saved in a folder of the same name containing the React component, CSS module, tests, and export file.

## Accessibility

Accessibility is a non-negotiable requirement. All components must conform to WCAG 2.1 Level AA before they are considered complete.

- Prefer semantic HTML over ARIA.
- All interactive elements: keyboard accessible, visible `:focus-visible`, accessible name/role/state exposed.
- Form controls require an associated label (`useId`), with `aria-invalid` + `aria-describedby` + `role="alert"` for errors.
- Meet WCAG 2.1 AA contrast; never color alone. Respect `prefers-reduced-motion`.
- Complex widgets follow the WAI-ARIA APG — don't invent patterns.
