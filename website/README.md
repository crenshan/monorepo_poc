# website

A Vite + React app that consumes [`@mono/ui`](../packages/ui/README.md) and [`@mono/utils`](../packages/utils/README.md) from the [monorepo](../README.md). Its `App.tsx` doubles as a live demo page exercising every component in `@mono/ui`.

## What it demonstrates

- Every `@mono/ui` component rendered with realistic props: `Button`/`Input` wired to a small "add two numbers" example (with number validation via `@mono/utils`'s `isValidNumber`, and the result shown in a `Modal` rather than a browser `alert`), `Input` with an error state, `Select`, all `Badge` variants, `Avatar` sizes, the `Icon` set, `Spinner` sizes, `Card`, all `Alert` variants, a `Modal` open/close flow, and `Toast` triggers.
- `ToastProvider` wraps the app in `main.tsx` so any component in the tree can call `useToast()`.
- `@mono/ui/tokens.css` is imported once (in `App.tsx`) to bring the design tokens' CSS custom properties into scope — required for any `@mono/ui` component's styling to apply.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Starts the Vite dev server |
| `pnpm build` | Typechecks and builds for production |
| `pnpm lint` | ESLint |
| `pnpm preview` | Serves the production build locally |

From the monorepo root, the same scripts are available via `pnpm --filter website <script>`, and `pnpm dev` at the root runs this app's dev server directly.
