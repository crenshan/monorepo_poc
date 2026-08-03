import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

import { Icon } from '../Icon';
import styles from './Select.module.css';

/** A single choice rendered as a native `<option>` inside a {@link Select}. */
export interface SelectOption {
  /** Value submitted/reported for this option (the native `option` value). */
  value: string;
  /** Text displayed to the user for this option. */
  label: string;
  /** When `true`, renders the option disabled so it cannot be chosen. */
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /**
   * Accessible label rendered above the select and associated via `htmlFor`/`id`.
   * Required (not optional) — same a11y rule as {@link Input}: no unlabeled selects.
   */
  label: ReactNode;
  /** When `true`, visually hides the label while keeping it in the accessibility
   * tree as the select's accessible name — use for compact contexts like a table cell. */
  hideLabel?: boolean;
  /** Validation error message. When set, renders a `role="alert"` message below the
   * select and marks the select `aria-invalid` with `aria-describedby` pointing at it. */
  error?: string;
  /** The list of selectable options, rendered in order as native `<option>` elements. */
  options: SelectOption[];
  /** Optional placeholder text shown as a disabled, hidden first option (value `''`)
   * when no real option has been chosen yet. */
  placeholder?: string;
}

/**
 * A native `<select>` dropdown with a required, associated label, an optional
 * placeholder option, and optional inline validation error. Reach for this when
 * a user must pick one value from a known, bounded list of options.
 *
 * Accessibility: the label is linked to the select with `htmlFor`/`id` (an id is
 * auto-generated via `useId` if none is passed), and when `error` is set the select
 * gets `aria-invalid="true"` plus `aria-describedby` pointing at the error message,
 * which is itself rendered with `role="alert"`. Keyboard interaction (opening,
 * arrow-key navigation, typeahead) is provided by the browser's native `<select>`.
 *
 * @category User Input
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   placeholder="Select a country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *   ]}
 *   value={country}
 *   onChange={(e) => setCountry(e.target.value)}
 * />
 * ```
 */
export function Select({
  label,
  hideLabel,
  error,
  options,
  placeholder,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const labelClasses = [styles['ds-select__label'], hideLabel && styles['ds-select__label--hidden']]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles['ds-select']}>
      <label className={labelClasses} htmlFor={selectId}>
        {label}
      </label>
      <div className={styles['ds-select__control']}>
        <select
          id={selectId}
          className={styles['ds-select__input']}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size="sm" className={styles['ds-select__chevron']} />
      </div>
      {error && (
        <span id={errorId} className={styles['ds-select__error']} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
