import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';
import styles from './Alert.module.css';

test('Alert renders its description', () => {
  render(<Alert>Something happened.</Alert>);

  expect(screen.getByText('Something happened.')).toBeInTheDocument();
});

test('Alert renders an optional title', () => {
  render(<Alert title="Heads up">Something happened.</Alert>);

  expect(screen.getByText('Heads up')).toBeInTheDocument();
});

test('Alert omits the title element when none is given', () => {
  const { container } = render(<Alert>Something happened.</Alert>);

  expect(container.querySelector(`.${styles['ds-alert__title']}`)).not.toBeInTheDocument();
});

test('Alert defaults to the neutral variant with a polite status role', () => {
  render(<Alert>Something happened.</Alert>);

  const alert = screen.getByRole('status');
  expect(alert).toHaveClass(styles['ds-alert'], styles['ds-alert--neutral']);
});

test('Alert uses an assertive alert role for the danger variant', () => {
  render(<Alert variant="danger">Something failed.</Alert>);

  expect(screen.getByRole('alert')).toHaveClass(styles['ds-alert--danger']);
});

test('Alert has no dismiss button by default', () => {
  render(<Alert>Something happened.</Alert>);

  expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
});

test('Alert renders a dismiss button and calls onDismiss when clicked', () => {
  const handleDismiss = vi.fn();
  render(<Alert onDismiss={handleDismiss}>Something happened.</Alert>);

  screen.getByRole('button', { name: 'Dismiss' }).click();

  expect(handleDismiss).toHaveBeenCalledTimes(1);
});

test('Alert forwards standard div props', () => {
  render(<Alert data-testid="alert">Something happened.</Alert>);

  expect(screen.getByTestId('alert')).toBeInTheDocument();
});
