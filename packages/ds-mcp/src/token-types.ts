/** The full shape of `tokens.json` — the design system's token manifest. */
export interface TokensManifest {
  /** The npm package these tokens are published under, e.g. `'@mono/ui'`. */
  package: string;
  /** The complete, ordered set of group names present in `tokens`, e.g. `['color', 'space', ...]`. */
  groups: string[];
  /** One entry per design token, flattened across all groups. */
  tokens: TokenEntry[];
}

/** A single design token. */
export interface TokenEntry {
  /** The token's group/category, e.g. `'color'` or `'space'`. */
  group: string;
  /** The token's key within its group, e.g. `'primary'`. */
  key: string;
  /** The dotted JS lookup key into `tokens`/`flatTokens`, e.g. `'color.primary'`. */
  jsKey: string;
  /** The generated CSS custom property name, e.g. `'--color-primary'`. */
  cssVar: string;
  /** The token's value, e.g. `'#0b5fff'`, `'16px'`, or `700`. */
  value: string | number;
}
