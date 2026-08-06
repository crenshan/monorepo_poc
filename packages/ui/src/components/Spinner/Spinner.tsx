import { Icon } from '../Icon';
import type { IconSize } from '../Icon';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** Size of the spinning icon. One of `'sm' | 'base' | 'lg' | 'xl'`. Defaults to `'base'`. */
  size?: IconSize;
  /**
   * Accessible label announced to screen readers via the `status` live
   * region; not shown visually. Defaults to `'Loading'`.
   */
  label?: string;
}

/**
 * An animated indicator that communicates an in-progress, indeterminate
 * operation (e.g. data fetching or async form submission). Reach for it
 * whenever content isn't ready to render yet and you need to signal that
 * work is happening.
 *
 * The root element uses `role="status"` so assistive technology announces
 * the `label` text as a live region update; the icon itself is purely
 * visual.
 *
 * @category Feedback
 *
 * @example
 * ```tsx
 * <Spinner size="lg" label="Loading results" />
 * ```
 *
 * @remarks
 * The root element uses `role="status"` so assistive technology announces the `label`
 * text as a live region update; the icon itself is purely visual.
 */
export function Spinner({ size = 'base', label = 'Loading' }: SpinnerProps) {
  return (
    <span className={styles['ds-spinner']} role="status">
      <Icon name="spinner" size={size} className={styles['ds-spinner__icon']} />
      <span className={styles['ds-spinner__label']}>{label}</span>
    </span>
  );
}
