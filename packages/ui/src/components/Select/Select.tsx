import { useId } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'

import { Icon } from '../Icon'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  // Same required-label rule as Input: no unlabeled selects.
  label: ReactNode
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export function Select({ label, error, options, placeholder, id, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className={styles['ds-select']}>
      <label className={styles['ds-select__label']} htmlFor={selectId}>
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
  )
}
