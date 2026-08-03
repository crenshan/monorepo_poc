import type { HTMLAttributes, ReactNode } from 'react';

import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside the card. */
  children: ReactNode;
}

/**
 * A container that groups related content in a bordered, padded surface.
 * Reach for it when laying out discrete blocks of content (list items,
 * summary panels, dashboard tiles, etc.) that should read as a single unit.
 * All standard `<div>` HTML attributes are supported and passed through to
 * the underlying element.
 *
 * @category Layout
 *
 * @example
 * ```tsx
 * <Card>
 *   <h3>Account summary</h3>
 *   <p>You have 3 pending invoices.</p>
 * </Card>
 * ```
 */
export function Card({ children, ...props }: CardProps) {
  return (
    <div className={styles['ds-card']} {...props}>
      {children}
    </div>
  );
}
