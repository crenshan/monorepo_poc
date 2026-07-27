import { useId } from 'react'
import type { ChangeEvent, InputHTMLAttributes } from 'react'

import styles from './DateRangePicker.module.css'

export interface DateRange {
  start: string
  end: string
}

export interface DateRangePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min' | 'max'> {
  // Same required-label rule as Input/Select: no unlabeled controls.
  label: string
  value: DateRange
  onChange: (value: DateRange) => void
  startLabel?: string
  endLabel?: string
  error?: string
  min?: string
  max?: string
}

export function DateRangePicker({
  label,
  value,
  onChange,
  startLabel = 'Start date',
  endLabel = 'End date',
  error,
  min,
  max,
  id,
  ...props
}: DateRangePickerProps) {
  const generatedId = useId()
  const groupId = id ?? generatedId
  const startId = `${groupId}-start`
  const endId = `${groupId}-end`
  const errorId = `${groupId}-error`

  const handleStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, start: event.target.value })
  }

  const handleEndChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, end: event.target.value })
  }

  return (
    <fieldset
      className={styles['ds-date-range']}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className={styles['ds-date-range__legend']}>{label}</legend>
      <div className={styles['ds-date-range__fields']}>
        <div className={styles['ds-date-range__field']}>
          <label className={styles['ds-date-range__label']} htmlFor={startId}>
            {startLabel}
          </label>
          <input
            id={startId}
            type="date"
            className={styles['ds-date-range__input']}
            value={value.start}
            onChange={handleStartChange}
            min={min}
            max={value.end || max}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          />
        </div>
        <span className={styles['ds-date-range__separator']} aria-hidden="true">
          &ndash;
        </span>
        <div className={styles['ds-date-range__field']}>
          <label className={styles['ds-date-range__label']} htmlFor={endId}>
            {endLabel}
          </label>
          <input
            id={endId}
            type="date"
            className={styles['ds-date-range__input']}
            value={value.end}
            onChange={handleEndChange}
            min={value.start || min}
            max={max}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          />
        </div>
      </div>
      {error && (
        <span id={errorId} className={styles['ds-date-range__error']} role="alert">
          {error}
        </span>
      )}
    </fieldset>
  )
}
