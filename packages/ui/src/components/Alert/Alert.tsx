import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import styles from './Alert.module.css';

/** Visual style of an {@link Alert}, which also determines its icon and ARIA role. */
export type AlertVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

const variantIcon: Record<AlertVariant, IconName> = {
  neutral: 'alertCircle',
  primary: 'alertCircle',
  success: 'check',
  warning: 'alertCircle',
  danger: 'alertCircle',
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Visual style and ARIA role of the alert. Defaults to `'neutral'`. */
  variant?: AlertVariant;
  /** Optional heading rendered above the alert's description. */
  title?: ReactNode;
  /** The alert's main message content. */
  children: ReactNode;
  /** Called when the user clicks the dismiss (×) button. If omitted, no dismiss button is rendered. */
  onDismiss?: () => void;
}

/**
 * Displays a short, dismissible status message to draw attention to important
 * information (success confirmations, warnings, errors, etc.). Reach for it when
 * you need to surface feedback about the result of an action or the current state
 * of the page. Danger-variant alerts use `role="alert"` for assertive
 * screen-reader announcements; all other variants use `role="status"` for polite
 * announcements.
 *
 * @category Feedback
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Changes saved">
 *   Your profile has been updated.
 * </Alert>
 * ```
 *
 * @remarks
 * Danger-variant alerts use `role="alert"` for assertive screen-reader announcements;
 * all other variants use `role="status"` for polite announcements.
 */
export function Alert({
  variant = 'neutral',
  title,
  children,
  onDismiss,
  className,
  ...props
}: AlertProps) {
  const classes = [styles['ds-alert'], styles[`ds-alert--${variant}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      // Danger needs an assertive interruption; everything else is a polite announcement.
      role={variant === 'danger' ? 'alert' : 'status'}
      {...props}
    >
      <Icon name={variantIcon[variant]} className={styles['ds-alert__icon']} />
      <div className={styles['ds-alert__content']}>
        {title && <p className={styles['ds-alert__title']}>{title}</p>}
        <div className={styles['ds-alert__description']}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          className={styles['ds-alert__dismiss']}
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <Icon name="x" size="sm" />
        </button>
      )}
    </div>
  );
}
