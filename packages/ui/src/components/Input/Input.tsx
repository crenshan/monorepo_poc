import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Accessible label rendered above the input and associated via `htmlFor`/`id`.
   * Required (not optional) — this is the a11y rule the CI agent enforces:
   * no unlabeled inputs are allowed.
   */
  label: ReactNode;
  /** Validation error message. When set, renders a `role="alert"` message below the
   * input and marks the input `aria-invalid` with `aria-describedby` pointing at it. */
  error?: string;
}

/**
 * A single-line text field with a required, associated label and optional inline
 * validation error. Reach for this any time you need a labelled native `<input>`
 * (text, email, date, etc. — via the native `type` prop) inside a form.
 *
 * Accessibility: the label is linked to the input with `htmlFor`/`id` (an id is
 * auto-generated via `useId` if none is passed), and when `error` is set the input
 * gets `aria-invalid="true"` plus `aria-describedby` pointing at the error message,
 * which is itself rendered with `role="alert"`.
 *
 * @category User Input
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email address"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 * />
 * ```
 */
export function Input({ label, error, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={styles['ds-field']}>
      <label className={styles['ds-field__label']} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={styles['ds-field__input']}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className={styles['ds-field__error']} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
