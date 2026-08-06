import { useId } from 'react';
import type { ReactNode } from 'react';

import { Input } from '../Input';
import styles from './DateRangePicker.module.css';

/** The current start/end selection of a {@link DateRangePicker}, as ISO date
 * strings (`YYYY-MM-DD`, matching the native `<input type="date">` format). */
export interface DateRangeValue {
  /** Start of the range, as an ISO date string (`YYYY-MM-DD`). */
  start: string;
  /** End of the range, as an ISO date string (`YYYY-MM-DD`). */
  end: string;
}

export interface DateRangePickerProps {
  /** Label grouping the two date fields, rendered as the `<fieldset>` legend. */
  label: ReactNode;
  /** The current start/end selection. This component is controlled — always pass
   * `value` together with `onChange`. */
  value: DateRangeValue;
  /** Called whenever either the start or end date field changes, with the full
   * updated `{ start, end }` value (the other field's value is preserved). */
  onChange: (value: DateRangeValue) => void;
  /** Label for the start date field. Defaults to `'Start date'`. */
  startLabel?: ReactNode;
  /** Label for the end date field. Defaults to `'End date'`. */
  endLabel?: ReactNode;
  /** Validation error message. When set, renders a `role="alert"` message below the
   * fields and marks the fieldset `aria-describedby` pointing at it. */
  error?: string;
  /** Earliest selectable date (ISO `YYYY-MM-DD`) for the start field. The end field's
   * effective minimum is the selected start date, falling back to this value. */
  min?: string;
  /** Latest selectable date (ISO `YYYY-MM-DD`) for the end field. The start field's
   * effective maximum is the selected end date, falling back to this value. */
  max?: string;
}

/**
 * A paired start/end date selector, rendered as a `<fieldset>` containing two
 * {@link Input} fields of type `date`. Reach for this whenever a user needs to
 * pick a bounded date range (e.g. filtering a report by date). The component is
 * controlled: it always reflects `value` and reports changes via `onChange`.
 *
 * Each field's bounds constrain the other to keep the range valid — the start
 * field's `max` is the selected end date (or the `max` prop), and the end field's
 * `min` is the selected start date (or the `min` prop).
 *
 * Accessibility: the two fields render as an `<fieldset>`/`<legend>` group so
 * screen readers announce them as related, each field keeps its own
 * label/`aria-invalid`/`aria-describedby` wiring via {@link Input}, and when
 * `error` is set the fieldset itself gets `aria-describedby` pointing at a
 * `role="alert"` error message. Date entry/keyboard interaction is provided by
 * the browser's native `<input type="date">`.
 *
 * @category User Input
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   label="Reporting period"
 *   value={range}
 *   onChange={setRange}
 *   min="2024-01-01"
 *   max="2026-12-31"
 * />
 * ```
 *
 * @remarks
 * Each field's bounds constrain the other to keep the range valid — the start field's
 * `max` is the selected end date (or the `max` prop), and the end field's `min` is the
 * selected start date (or the `min` prop). The two fields render as an
 * `<fieldset>`/`<legend>` group so screen readers announce them as related, each field
 * keeps its own label/`aria-invalid`/`aria-describedby` wiring via {@link Input}, and
 * when `error` is set the fieldset itself gets `aria-describedby` pointing at a
 * `role="alert"` error message. Date entry/keyboard interaction is provided by the
 * browser's native `<input type="date">`.
 */
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
  const generatedId = useId();
  const errorId = `${generatedId}-error`;

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
  );
}
