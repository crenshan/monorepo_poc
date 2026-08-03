import type { ReactNode } from 'react';

// Icon registry: maps each supported icon name to its SVG child markup (paths/shapes
// only, no outer <svg>). Consumed by `Icon`, which renders the outer <svg> and looks up
// the requested name here.
// Small, hand-authored set for the POC — add new names here as new icons are needed.

/** Names of the icons available to render via `<Icon name="..." />`. */
export type IconName = 'check' | 'x' | 'chevronDown' | 'alertCircle' | 'spinner';

/** Maps each {@link IconName} to its SVG child content, rendered inside `Icon`'s `<svg>` wrapper. */
export const icons: Record<IconName, ReactNode> = {
  check: <path d="M5 13l4 4L19 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v6" />
      <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  spinner: (
    <>
      <circle cx="12" cy="12" r="9" opacity={0.25} />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </>
  ),
};
