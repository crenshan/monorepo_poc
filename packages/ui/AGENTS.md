# UI Library

UI library containing design tokens and components to be utilized across web apps.

## Package Structure

```txt
 .
├── scripts/                    — build tooling (tokens.css + tokens.json + components.json generators)
├── generated/                  — build artifacts read by ds-mcp; never hand-edit, see Hard Boundaries
│   ├── components.json             — component/prop manifest (generated, see JSDoc requirements below)
│   └── tokens.json                 — flat token manifest (generated, see tokens.ts)
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
- If a spacing or size value is a design decision rather than layout mechanics and doesn't map to an existing token, add a token to `tokens.ts` rather than hardcoding it, then run `pnpm run tokens` (from the repo root) to regenerate both `tokens.css` and `generated/tokens.json`. CI regenerates and diffs both — a stale commit of either fails the build.
- `generated/components.json` is generated from component/hook source via ts-morph (`scripts/generate-components-json.ts`) — never hand-edit it. Run `pnpm run tokens` (from the repo root) to regenerate after changing a component; CI regenerates and diffs it, so a stale commit fails the build. A component/hook is picked up automatically (exported, PascalCase name, JSX in its body — or `use[A-Z]...` for a hook); the generator then requires `@category`/`@example` on it and throws a build error naming the file if either is missing, so a documentation gap fails loudly instead of silently omitting the entry.
- When building composite or more complex components, reuse smaller atomic components within this library if applicable.
- Before changing an existing component's props or behavior, call the `ds` MCP server's `search_usage_examples` to see how `website/` (and other consumers) currently use it, so you catch breaking changes before making them. Before adding a new token to `tokens.ts`, call `get_tokens` to check a suitable one doesn't already exist.
- All components are saved in a folder of the same name containing the React component, CSS module, tests, and export file.
- Every exported component (and hook) requires a JSDoc block directly above its declaration: a 1-2 sentence description of what it does and when to use it, an `@category` tag (`Layout`, `Feedback`, `Data Display`, `User Input`, `Overlay`, `Navigation`, or `Decorative`), and an `@example` with a realistic usage snippet in a fenced ```tsx code block. Both tags are required by the `components.json` generator — a missing one fails the build. Hooks additionally require an `@returns` tag describing the return value — the generator fails the build without it. Put any accessibility/behavior asides (focus management, ARIA wiring, "throws" conditions) in an `@remarks` tag (and/or `@throws` for hooks) placed after `@example`/`@returns` — these feed the manifest's `notes` field. Don't leave such prose dangling after `@example` in the comment with no tag of its own; JSDoc treats it as part of `@example`'s text.
- Every prop in a component's Props interface requires an inline `/** ... */` doc comment describing what it controls, valid values for unions, and its default (if destructured), on an explicitly-typed property (no inferred types). Exported standalone types (variant unions, option shapes, etc.) require a one-line doc comment on the type itself, and — for object-shaped types — the same explicit-type-plus-doc-comment requirement on every one of its fields; the generator fails the build on any field missing either. Don't redocument inherited native HTML attributes — only props declared on the custom interface. A component's parameter must be typed via a named interface (or a bare external type like `TableHTMLAttributes<...>`) — never an inline type literal — since the generator resolves props from the actual parameter type, not a guessed `{Name}Props` name.

Example:

````tsx
/**
 * Displays a short, dismissible status message to draw attention to important
 * information (success confirmations, warnings, errors, etc.).
 *
 * @category Feedback
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Changes saved">
 *   Your profile has been updated.
 * </Alert>
 * ```
 *
 * @remarks
 * Danger-variant alerts use `role="alert"` for assertive screen-reader announcements;
 * all other variants use `role="status"` for polite announcements.
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
