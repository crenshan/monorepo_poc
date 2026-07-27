# Demo Website

Demo web app used for the purpose of illustrating the use of library dependencies located within the same monorepo.

## Hard Boundaries

- Use `@mono/ui` tokens (`--color-*`, `--space-*`, `--fontSize-*`, `--radius-*`). The variables in `src/index.css` (`--text`, `--border`, `--text-h`) are deprecated — don't use them in new code.
- No raw px or hex in view CSS
- Always check the @mono/ui barrel export before writing new markup. If a primitive exists, use it.
  If a needed primitive doesn't exist in @mono/ui, stop and ask — don't build it locally.
- Views live in src/views/, one folder each (.tsx + .css).
