import type { HTMLAttributes, ReactNode } from 'react';

import styles from './Badge.module.css';

/** Visual style of a {@link Badge}. */
export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The label content rendered inside the badge, typically a short word or count. */
  children: ReactNode;
  /** Visual style of the badge. Defaults to `'neutral'`. */
  variant?: BadgeVariant;
}

/**
 * Renders a small, inline label used to tag an item with a status, category, or
 * count (e.g. "New", "Beta", an unread count). Reach for it when you need a
 * compact, non-interactive visual marker alongside other content.
 *
 * @category Data Display
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * ```
 */
export function Badge({ children, variant = 'neutral', className, ...props }: BadgeProps) {
  const classes = [styles['ds-badge'], styles[`ds-badge--${variant}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
