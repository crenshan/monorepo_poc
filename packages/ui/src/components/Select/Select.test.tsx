import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';

const testLabel = 'Country';
const options = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico', disabled: true },
];

test('Select should be rendered with its options', () => {
  render(<Select label={testLabel} options={options} />);

  expect(screen.getByRole('combobox')).toBeInTheDocument();
  expect(screen.getAllByRole('option')).toHaveLength(3);
});

test('Select associates the label with the control', () => {
  render(<Select label={testLabel} options={options} />);

  expect(screen.getByLabelText(testLabel)).toBe(screen.getByRole('combobox'));
});

test('Select renders a disabled, hidden placeholder option', () => {
  const { container } = render(
    <Select label={testLabel} options={options} placeholder="Choose a country" />,
  );

  const placeholderOption = container.querySelector('option[value=""]');
  expect(placeholderOption).toHaveTextContent('Choose a country');
  expect(placeholderOption).toBeDisabled();
  expect(placeholderOption).toHaveAttribute('hidden');
});

test('Select marks individual options as disabled', () => {
  render(<Select label={testLabel} options={options} />);

  expect(screen.getByRole('option', { name: 'Mexico' })).toBeDisabled();
});

test('Select forwards standard select props', () => {
  render(<Select label={testLabel} options={options} disabled />);

  expect(screen.getByRole('combobox')).toBeDisabled();
});

test('Select calls onChange when a new option is chosen', () => {
  const handleChange = vi.fn();
  render(<Select label={testLabel} options={options} onChange={handleChange} />);

  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ca' } });

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('combobox')).toHaveValue('ca');
});

test('Select keeps the accessible name when the label is visually hidden', () => {
  render(<Select label={testLabel} options={options} hideLabel />);

  expect(screen.getByLabelText(testLabel)).toBe(screen.getByRole('combobox'));
});

test('Select shows an error message and marks the control invalid', () => {
  render(<Select label={testLabel} options={options} error="Please choose a country" />);

  const select = screen.getByRole('combobox');
  const errorMessage = screen.getByRole('alert');

  expect(select).toHaveAttribute('aria-invalid', 'true');
  expect(errorMessage).toHaveTextContent('Please choose a country');
  expect(select).toHaveAttribute('aria-describedby', errorMessage.id);
});
