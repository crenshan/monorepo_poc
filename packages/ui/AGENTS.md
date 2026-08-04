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

- Use `var(--*)` tokens (`--{group}-{key}` — read `src/tokens.ts` for the available set, never invent names) for spacing, color, typography, and radii. Raw values are acceptable for layout mechanics (percentages, viewport units, `fr`, `flex`, container max-widths, 1px borders).
- If a spacing or size value is a design decision rather than layout mechanics and doesn't map to an existing token, add a token to `tokens.ts` rather than hardcoding it, then run `pnpm run token-css`.
- When building composite or more complex components, reuse smaller atomic components within this library if applicable.
- All components are saved in a folder of the same name containing the React component, CSS module, tests, and export file.
- Every exported component (and hook) requires a JSDoc block directly above its declaration: a 1-2 sentence description of what it does and when to use it, an `@category` tag (`Layout`, `Feedback`, `Data Display`, `User Input`, `Overlay`, `Navigation`, or `Decorative`), and an `@example` with a realistic usage snippet in a fenced ```tsx code block. Note focus/keyboard/ARIA behavior in the description when relevant.
- Every prop in a component's Props interface requires an inline `/** ... */` doc comment describing what it controls, valid values for unions, and its default (if destructured). Exported standalone types (variant unions, option shapes, etc.) require a one-line doc comment. Don't redocument inherited native HTML attributes — only props declared on the custom interface.

Example:

````tsx
/**
 * Displays a short, dismissible status message to draw attention to important
 * information (success confirmations, warnings, errors, etc.). Danger-variant
 * alerts use `role="alert"` for assertive screen-reader announcements; all
 * other variants use `role="status"` for polite announcements.
 *
 * @category Feedback
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Changes saved">
 *   Your profile has been updated.
 * </Alert>
 * ```
 */
export function Alert({ variant = 'neutral', title, children, onDismiss }: AlertProps) {
  /* ... */
}

export interface AlertProps {
  /** Visual style and ARIA role of the alert. Defaults to `'neutral'`. */
  variant?: AlertVariant;
  /** Called when the user clicks the dismiss button. If omitted, no dismiss button is rendered. */
  onDismiss?: () => void;
}
````

## Accessibility

Accessibility is a non-negotiable requirement. All components must conform to WCAG 2.1 Level AA before they are considered complete.

- Prefer semantic HTML over ARIA.
- All interactive elements: keyboard accessible, visible `:focus-visible`, accessible name/role/state exposed.
- Form controls require an associated label (`useId`), with `aria-invalid` + `aria-describedby` + `role="alert"` for errors.
- Meet WCAG 2.1 AA contrast; never color alone. Respect `prefers-reduced-motion`.
- Complex widgets follow the WAI-ARIA APG — don't invent patterns.
