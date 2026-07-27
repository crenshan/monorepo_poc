import { useState } from 'react';
import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from './DateRangePicker';
import type { DateRangeValue } from './DateRangePicker';

function ControlledDateRangePicker() {
  const [value, setValue] = useState<DateRangeValue>({ start: '2026-01-01', end: '2026-01-31' });
  return <DateRangePicker label="Report period" value={value} onChange={setValue} />;
}

test('DateRangePicker renders the group label as a legend', () => {
  render(
    <DateRangePicker label="Report period" value={{ start: '', end: '' }} onChange={vi.fn()} />,
  );

  expect(screen.getByRole('group', { name: 'Report period' })).toBeInTheDocument();
});

test('DateRangePicker renders labeled start and end date inputs', () => {
  render(
    <DateRangePicker label="Report period" value={{ start: '', end: '' }} onChange={vi.fn()} />,
  );

  expect(screen.getByLabelText('Start date')).toHaveAttribute('type', 'date');
  expect(screen.getByLabelText('End date')).toHaveAttribute('type', 'date');
});

test('DateRangePicker supports custom field labels', () => {
  render(
    <DateRangePicker
      label="Report period"
      startLabel="From"
      endLabel="To"
      value={{ start: '', end: '' }}
      onChange={vi.fn()}
    />,
  );

  expect(screen.getByLabelText('From')).toBeInTheDocument();
  expect(screen.getByLabelText('To')).toBeInTheDocument();
});

test('DateRangePicker calls onChange with the updated start date', () => {
  const handleChange = vi.fn();
  render(
    <DateRangePicker
      label="Report period"
      value={{ start: '2026-01-01', end: '2026-01-31' }}
      onChange={handleChange}
    />,
  );

  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2026-01-05' } });

  expect(handleChange).toHaveBeenCalledWith({ start: '2026-01-05', end: '2026-01-31' });
});

test('DateRangePicker calls onChange with the updated end date', () => {
  const handleChange = vi.fn();
  render(
    <DateRangePicker
      label="Report period"
      value={{ start: '2026-01-01', end: '2026-01-31' }}
      onChange={handleChange}
    />,
  );

  fireEvent.change(screen.getByLabelText('End date'), { target: { value: '2026-02-01' } });

  expect(handleChange).toHaveBeenCalledWith({ start: '2026-01-01', end: '2026-02-01' });
});

test('DateRangePicker constrains each field by the other selected date', () => {
  render(
    <DateRangePicker
      label="Report period"
      value={{ start: '2026-01-01', end: '2026-01-31' }}
      onChange={vi.fn()}
    />,
  );

  expect(screen.getByLabelText('Start date')).toHaveAttribute('max', '2026-01-31');
  expect(screen.getByLabelText('End date')).toHaveAttribute('min', '2026-01-01');
});

test('DateRangePicker shows an error message', () => {
  render(
    <DateRangePicker
      label="Report period"
      value={{ start: '2026-02-01', end: '2026-01-01' }}
      onChange={vi.fn()}
      error="End date must be on or after the start date"
    />,
  );

  expect(screen.getByRole('alert')).toHaveTextContent(
    'End date must be on or after the start date',
  );
});

test('DateRangePicker works as a controlled component', () => {
  render(<ControlledDateRangePicker />);

  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2026-01-10' } });

  expect(screen.getByLabelText('Start date')).toHaveValue('2026-01-10');
});
