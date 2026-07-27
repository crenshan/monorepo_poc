import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Label is required, not optional — the a11y feature the CI agent enforces:
  // no unlabeled inputs allowed.
  label: ReactNode;
  error?: string;
}

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
