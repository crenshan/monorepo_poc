# Design System MCP Server

MCP server that exposes `@mono/ui`'s components and tokens to AI agents (list/search components, read props, look up tokens, and pull curated usage examples).

## Package Structure

```txt
 .
└── src/
    ├── index.ts           — thin entrypoint: builds the server and connects it to stdio
    ├── server.ts          — createServer(): registers every tool, resource, and prompt
    ├── server.test.ts     — tests for server.ts, run through a real MCP client
    ├── examples.ts        — curated usage snippets served by search_usage_examples
    ├── manifest-types.ts  — types for ../ui/components.json
    └── token-types.ts     — types for ../ui/tokens.json
```

## Hard Boundaries

- Keep `createServer()` (`server.ts`) free of any transport/stdio side effects — connecting a transport only happens in `index.ts`. This is what lets tests build a server and talk to it over `InMemoryTransport` without spawning a process.
- This package only reads `../ui/components.json` and `../ui/tokens.json`. It never writes to them. `tokens.json` is generated (`pnpm run tokens` from the repo root) and CI fails on drift; `components.json` is hand-maintained with no generator and no CI check — if a component's props change without a matching edit there, this server keeps serving stale prop data. Flag it if you notice a mismatch.
- New tools/resources/prompts are registered inside `createServer()` in `server.ts`.
- Test tools through a real MCP `Client` connected via `InMemoryTransport.createLinkedPair()` (see `server.test.ts`), not by importing and calling a handler callback directly — that's what actually exercises registration and schema validation.
- `*.test.ts` files must stay out of `dist/`. `pnpm build` uses `tsconfig.build.json` (which excludes them) — don't repoint `build` at the base `tsconfig.json`.
