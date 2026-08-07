// Generates tokens.json — a flat, tooling-friendly listing of every design token (JS
// dotted key, CSS variable name, and value), grouped by category. Consumed by the
// ds-mcp `get_tokens` tool. Run it whenever tokens change: npx tsx scripts/generate-tokens-json.ts
// This keeps tokens.ts as the single source of truth — tokens.json is a build artifact,
// never hand-edited.

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tokens, flatTokens, cssVarName } from '../src/tokens.ts';
import type { TokenGroup } from '../src/tokens.ts';

interface TokenEntry {
  group: TokenGroup;
  key: string;
  jsKey: string;
  cssVar: string;
  value: string | number;
}

const groups = Object.keys(tokens) as TokenGroup[];

const entries: TokenEntry[] = Object.entries(flatTokens).map(([jsKey, value]) => {
  const dotIndex = jsKey.indexOf('.');
  const group = jsKey.slice(0, dotIndex) as TokenGroup;
  const key = jsKey.slice(dotIndex + 1);
  return { group, key, jsKey, cssVar: cssVarName(jsKey), value };
});

const manifest = {
  package: '@mono/ui',
  groups,
  tokens: entries,
};

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'generated', 'tokens.json');
writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath} (${entries.length} tokens across ${groups.length} groups)`);
