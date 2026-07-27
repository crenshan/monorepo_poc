import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import styles from './Icon.module.css';

test('Icon is hidden from assistive tech by default', () => {
  const { container } = render(<Icon name="check" />);

  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg).not.toHaveAttribute('role');
});

test('Icon becomes an accessible image when given a title', () => {
  render(<Icon name="check" title="Success" />);

  expect(screen.getByRole('img', { name: 'Success' })).toBeInTheDocument();
});

test('Icon applies the requested size class', () => {
  const { container } = render(<Icon name="x" size="lg" />);

  expect(container.querySelector('svg')).toHaveClass(styles['ds-icon'], styles['ds-icon--lg']);
});

test('Icon defaults to the base size', () => {
  const { container } = render(<Icon name="x" />);

  expect(container.querySelector('svg')).toHaveClass(styles['ds-icon--base']);
});

test('Icon forwards standard svg props', () => {
  render(<Icon name="chevronDown" data-testid="chevron" />);

  expect(screen.getByTestId('chevron')).toBeInTheDocument();
});
