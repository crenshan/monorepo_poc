import type { SVGAttributes } from 'react';

import { icons } from './icons';
import type { IconName } from './icons';
import styles from './Icon.module.css';

export type { IconName };
/** Available rendered sizes for {@link Icon}, mapped to CSS modifier classes. */
export type IconSize = 'sm' | 'base' | 'lg' | 'xl';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'name'> {
  /** Which icon from the registry (see {@link IconName}) to render. */
  name: IconName;
  /** Rendered size of the icon. Defaults to `'base'`. */
  size?: IconSize;
  /**
   * When provided, the icon becomes an accessible image with this as its accessible name
   * (rendered as an SVG `<title>`, with `role="img"`). Omitted (the default) means the
   * icon is treated as decorative and hidden from assistive tech via `aria-hidden`.
   */
  title?: string;
}

/**
 * Renders a single icon from the design system's icon registry as an inline SVG.
 * Reach for it anywhere a small, currentColor-tinted vector graphic is needed
 * (buttons, status indicators, etc.).
 *
 * @category Decorative
 *
 * @example
 * ```tsx
 * <Icon name="check" size="sm" />
 * ```
 *
 * Accessibility: by default the icon is purely decorative (`aria-hidden="true"`) since
 * it has no accessible name. Pass `title` to expose it to assistive technology as a
 * named image (`role="img"` with an SVG `<title>`) — do this when the icon conveys
 * meaning that isn't otherwise available as text nearby (e.g. an icon-only button).
 */
export function Icon({ name, size = 'base', title, className, ...props }: IconProps) {
  const classes = [styles['ds-icon'], styles[`ds-icon--${size}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={classes}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title && <title>{title}</title>}
      {icons[name]}
    </svg>
  );
}
