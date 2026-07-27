import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import styles from './Alert.module.css';

export type AlertVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

const variantIcon: Record<AlertVariant, IconName> = {
  neutral: 'alertCircle',
  primary: 'alertCircle',
  success: 'check',
  warning: 'alertCircle',
  danger: 'alertCircle',
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: ReactNode;
  children: ReactNode;
  onDismiss?: () => void;
}

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
