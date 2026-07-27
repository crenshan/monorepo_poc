// The single source of truth for all design tokens.
// Components read the nested object; the MCP server reads flatTokens;
// the CSS-variable string is generated from the same data. One source, three consumers.
const colors = {
  white: '#fff',
  black: '#000',

  blue100: '#e6efff',
  blue200: '#c0d7ff',
  blue300: '#8fb6ff',
  blue400: '#5c92ff',
  blue500: '#2d6fff',
  blue600: '#0b5fff',
  blue700: '#0847c4',
  blue800: '#06349a',
  blue900: '#042670',

  red100: '#fce8e9',
  red200: '#f6c1c4',
  red300: '#ec949a',
  red400: '#dd646d',
  red500: '#c5303a',
  red600: '#a92832',
  red700: '#8c1f28',
  red800: '#6e171e',
  red900: '#4f0f14',

  green100: '#e5f6ec',
  green200: '#bfe8cf',
  green300: '#8fd6ac',
  green400: '#57bd83',
  green500: '#1f9254',
  green600: '#197a46',
  green700: '#136138',
  green800: '#0d492a',
  green900: '#08301c',

  amber100: '#fdf3e2',
  amber200: '#f7dfb0',
  amber300: '#efc57a',
  amber400: '#e2a84f',
  amber500: '#b7791f',
  amber600: '#976419',
  amber700: '#775013',
  amber800: '#583b0e',
  amber900: '#392609',

  gray100: '#f4f6f9',
  gray200: '#e7eaef',
  gray300: '#d5dae1',
  gray400: '#adb4bf',
  gray500: '#828b98',
  gray600: '#5a6472',
  gray700: '#3d4551',
  gray800: '#1a1f29',
  gray900: '#0d1016',
};

export const tokens = {
  color: {
    ...colors,

    primary: colors.blue600,
    primaryHover: colors.blue700,
    success: colors.green500,
    warning: colors.amber500,
    danger: colors.red500,
    text: colors.gray100,
    textMuted: colors.gray400,
    border: colors.gray600,
    surface: colors.gray800,
    surfaceSubtle: colors.gray700,
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
  },
  fontSize: {
    sm: '13px',
    base: '15px',
    lg: '18px',
    xl: '24px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  radius: {
    sm: '4px',
    md: '8px',
    pill: '999px',
  },
} as const;

export type Tokens = typeof tokens;
export type TokenGroup = keyof Tokens;

// Flat lookup with dotted keys — the shape the MCP get_tokens endpoint returns,
// and the basis for the CSS variable names.
export const flatTokens: Record<string, string | number> = Object.fromEntries(
  Object.entries(tokens).flatMap(([group, values]) =>
    Object.entries(values).map(([key, val]) => [`${group}.${key}`, val]),
  ),
);
// flatTokens["color.primary"] === "#0B5FFF"

// The CSS variable name for a given dotted token key.
// "color.primary" -> "--color-primary"
export const cssVarName = (dottedKey: string): string => `--${dottedKey.replace(/\./g, '-')}`;

// Convenience for use inside inline styles or CSS-in-JS if ever needed:
// cssVar("color.primary") -> "var(--color-primary)"
export const cssVar = (dottedKey: string): string => `var(${cssVarName(dottedKey)})`;
