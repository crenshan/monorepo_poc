import { Icon } from '../Icon';
import type { IconSize } from '../Icon';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: IconSize;
  // Announced to screen readers via the live region; not shown visually.
  label?: string;
}

export function Spinner({ size = 'base', label = 'Loading' }: SpinnerProps) {
  return (
    <span className={styles['ds-spinner']} role="status">
      <Icon name="spinner" size={size} className={styles['ds-spinner__icon']} />
      <span className={styles['ds-spinner__label']}>{label}</span>
    </span>
  );
}
