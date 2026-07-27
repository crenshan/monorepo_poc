import { useId } from 'react'
import type { ReactNode } from 'react'

import { Input } from '../Input'
import styles from './DateRangePicker.module.css'

export interface DateRangeValue {
  start: string
  end: string
}

export interface DateRangePickerProps {
  // Groups the two fields — rendered as the fieldset legend.
  label: ReactNode
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  startLabel?: ReactNode
  endLabel?: ReactNode
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
}: DateRangePickerProps) {
  const generatedId = useId()
  const errorId = `${generatedId}-error`

  return (
    <fieldset className={styles['ds-dateRange']} aria-describedby={error ? errorId : undefined}>
      <legend className={styles['ds-dateRange__legend']}>{label}</legend>
      <div className={styles['ds-dateRange__fields']}>
        <Input
          label={startLabel}
          type="date"
          value={value.start}
          min={min}
          max={value.end || max}
          onChange={(event) => onChange({ ...value, start: event.target.value })}
        />
        <span className={styles['ds-dateRange__separator']} aria-hidden="true">
          &ndash;
        </span>
        <Input
          label={endLabel}
          type="date"
          value={value.end}
          min={value.start || min}
          max={max}
          onChange={(event) => onChange({ ...value, end: event.target.value })}
        />
      </div>
      {error && (
        <span id={errorId} className={styles['ds-dateRange__error']} role="alert">
          {error}
        </span>
      )}
    </fieldset>
  )
}
