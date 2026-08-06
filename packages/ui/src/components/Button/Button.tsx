import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Content rendered inside the button. */
  children: ReactNode;
}

/**
 * A clickable button styled to match the design system, for triggering actions
 * such as submitting a form or opening a dialog.
 *
 * @category User Input
 *
 * @example
 * ```tsx
 * <Button onClick={handleSave} disabled={isSaving}>
 *   Save changes
 * </Button>
 * ```
 *
 * @remarks
 * All standard button HTML attributes (`onClick`, `disabled`, `type`, etc.) are
 * supported and passed through to the underlying `<button>` element.
 */
export function Button({ children, ...props }: ButtonProps) {
  return (
    <button className={styles['ds-button']} {...props}>
      {children}
    </button>
  );
}
