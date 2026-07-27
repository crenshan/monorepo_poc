import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import styles from './Button.module.css';

test('Button should be rendered', () => {
  render(<Button>Hello</Button>);

  expect(screen.getByText(/Hello/)).toBeInTheDocument();
});

test('Button applies the ds-button class', () => {
  render(<Button>Hello</Button>);

  expect(screen.getByRole('button')).toHaveClass(styles['ds-button']);
});

test('Button forwards standard button props', () => {
  render(
    <Button type="submit" disabled>
      Hello
    </Button>,
  );

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('type', 'submit');
  expect(button).toBeDisabled();
});

test('Button calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Hello</Button>);

  fireEvent.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('Button does not call onClick when disabled', () => {
  const handleClick = vi.fn();
  render(
    <Button onClick={handleClick} disabled>
      Hello
    </Button>,
  );

  fireEvent.click(screen.getByRole('button'));

  expect(handleClick).not.toHaveBeenCalled();
});
