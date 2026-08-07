# Demo Website

Demo web app used for the purpose of illustrating the use of library dependencies located within the same monorepo.

## Hard Boundaries

- Use `@mono/ui` tokens (`--space-*`, `--color-*`, `--fontSize-*`, `--radius-*`) for spacing, color, typography, and radii. The variables in `src/index.css` (`--text`, `--border`, `--text-h`) are deprecated — don't use them in new code.
  - ✅ `padding: var(--space-sm) var(--space-md);`
  - ❌ `padding: var(--border) var(--text-h);`
- Raw values are acceptable for layout mechanics (percentages, viewport units, `fr`, `flex`, container max-widths, 1px borders) — these aren't design decisions, they're structural.
  - ✅ `width: 100%; max-width: 720px; border: 1px solid var(--color-border);`
- If a spacing or size value is a design decision rather than layout mechanics and doesn't map to an existing token, add a token to `packages/ui/src/tokens.ts` rather than hardcoding it — don't invent one-off values in view CSS.
- Before building or updating a view, use the `ds` MCP server rather than reading `packages/ui` source directly: call `search_usage_examples` for the pattern you're building (table with filtering, modal confirmation, loading/error states, etc.) to match an established composition before inventing one, then `list_components`/`get_component_props` for exact prop shapes of anything you plan to use. The `new-view` prompt on the same server walks this sequence end to end — prefer invoking it over reconstructing the workflow from scratch.
- If a needed primitive doesn't exist in @mono/ui, stop and ask — don't build it locally.
- Never introduce raw semantic markup for a UI primitive (tables, dialogs, menus, form controls) in website/, even if similar markup exists elsewhere. Stop and ask.
- Views live in src/views/ as a flat file pair each: ViewName.tsx + ViewName.css (e.g. LoginView.tsx + LoginView.css) — not a subfolder per view.
