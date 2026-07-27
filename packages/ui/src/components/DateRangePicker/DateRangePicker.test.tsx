import { test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DateRangePicker } from './DateRangePicker'

const testLabel = 'Date range'
const emptyRange = { start: '', end: '' }

test('DateRangePicker renders a labeled group with start and end inputs', () => {
  render(<DateRangePicker label={testLabel} value={emptyRange} onChange={() => {}} />)

  expect(screen.getByRole('group', { name: testLabel })).toBeInTheDocument()
  expect(screen.getByLabelText('Start date')).toBeInTheDocument()
  expect(screen.getByLabelText('End date')).toBeInTheDocument()
})

test('DateRangePicker supports custom field labels', () => {
  render(
    <DateRangePicker
      label={testLabel}
      value={emptyRange}
      onChange={() => {}}
      startLabel="From"
      endLabel="To"
    />,
  )

  expect(screen.getByLabelText('From')).toBeInTheDocument()
  expect(screen.getByLabelText('To')).toBeInTheDocument()
})

test('DateRangePicker displays a controlled value', () => {
  render(
    <DateRangePicker
      label={testLabel}
      value={{ start: '2026-01-01', end: '2026-01-31' }}
      onChange={() => {}}
    />,
  )

  expect(screen.getByLabelText('Start date')).toHaveValue('2026-01-01')
  expect(screen.getByLabelText('End date')).toHaveValue('2026-01-31')
})

test('DateRangePicker calls onChange with the updated range when the start date changes', () => {
  const handleChange = vi.fn()
  render(
    <DateRangePicker
      label={testLabel}
      value={{ start: '', end: '2026-01-31' }}
      onChange={handleChange}
    />,
  )

  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2026-01-15' } })

  expect(handleChange).toHaveBeenCalledWith({ start: '2026-01-15', end: '2026-01-31' })
})

test('DateRangePicker calls onChange with the updated range when the end date changes', () => {
  const handleChange = vi.fn()
  render(
    <DateRangePicker
      label={testLabel}
      value={{ start: '2026-01-01', end: '' }}
      onChange={handleChange}
    />,
  )

  fireEvent.change(screen.getByLabelText('End date'), { target: { value: '2026-01-15' } })

  expect(handleChange).toHaveBeenCalledWith({ start: '2026-01-01', end: '2026-01-15' })
})

test('DateRangePicker constrains the start input to not exceed the end date', () => {
  render(
    <DateRangePicker
      label={testLabel}
      value={{ start: '', end: '2026-01-31' }}
      onChange={() => {}}
    />,
  )

  expect(screen.getByLabelText('Start date')).toHaveAttribute('max', '2026-01-31')
})

test('DateRangePicker constrains the end input to not precede the start date', () => {
  render(
    <DateRangePicker
      label={testLabel}
      value={{ start: '2026-01-01', end: '' }}
      onChange={() => {}}
    />,
  )

  expect(screen.getByLabelText('End date')).toHaveAttribute('min', '2026-01-01')
})

test('DateRangePicker has no error styling or message by default', () => {
  render(<DateRangePicker label={testLabel} value={emptyRange} onChange={() => {}} />)

  expect(screen.getByLabelText('Start date')).not.toHaveAttribute('aria-invalid')
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('DateRangePicker shows an error message and marks both inputs invalid', () => {
  render(
    <DateRangePicker
      label={testLabel}
      value={emptyRange}
      onChange={() => {}}
      error="End date must be after start date"
    />,
  )

  const errorMessage = screen.getByRole('alert')
  expect(errorMessage).toHaveTextContent('End date must be after start date')
  expect(screen.getByLabelText('Start date')).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByLabelText('End date')).toHaveAttribute('aria-invalid', 'true')
})
