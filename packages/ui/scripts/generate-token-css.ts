// Generates tokens.css (a :root block of CSS custom properties) from tokens.ts.
// Run it whenever tokens change:  npx tsx src/generate-tokens-css.ts
// This keeps tokens.ts as the single source of truth — the CSS is a build artifact,
// never hand-edited. (That "generated, not hand-edited" property is also what makes
// the CI compliance story clean later.)

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { flatTokens, cssVarName } from '../src/tokens.ts';

const lines = Object.entries(flatTokens)
  .map(([key, val]) => `  ${cssVarName(key)}: ${val};`)
  .join('\n');

const css = `/* GENERATED FROM tokens.ts — do not edit by hand. Run generate-tokens-css.ts. */
:root {
${lines}
}
`;

const outPath = join(dirname(fileURLToPath(import.meta.url)), '../src', 'tokens.css');
writeFileSync(outPath, css, 'utf8');
console.log(`Wrote ${outPath} (${Object.keys(flatTokens).length} tokens)`);
