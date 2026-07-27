import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';
import styles from './Modal.module.css';

test('Modal renders nothing when closed', () => {
  render(
    <Modal open={false} onClose={() => {}} title="Title">
      Body
    </Modal>,
  );

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('Modal renders the title and children when open', () => {
  render(
    <Modal open onClose={() => {}} title="Delete item">
      Are you sure?
    </Modal>,
  );

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAccessibleName('Delete item');
  expect(screen.getByText('Are you sure?')).toBeInTheDocument();
});

test('Modal focuses the dialog when it opens', () => {
  render(
    <Modal open onClose={() => {}} title="Title">
      Body
    </Modal>,
  );

  expect(screen.getByRole('dialog')).toHaveFocus();
});

test('Modal calls onClose when Escape is pressed', () => {
  const handleClose = vi.fn();
  render(
    <Modal open onClose={handleClose} title="Title">
      Body
    </Modal>,
  );

  fireEvent.keyDown(document, { key: 'Escape' });

  expect(handleClose).toHaveBeenCalledTimes(1);
});

test('Modal calls onClose when the overlay is clicked', () => {
  const handleClose = vi.fn();
  render(
    <Modal open onClose={handleClose} title="Title">
      Body
    </Modal>,
  );

  fireEvent.click(document.querySelector(`.${styles['ds-modal__overlay']}`)!);

  expect(handleClose).toHaveBeenCalledTimes(1);
});

test('Modal does not call onClose when its content is clicked', () => {
  const handleClose = vi.fn();
  render(
    <Modal open onClose={handleClose} title="Title">
      Body
    </Modal>,
  );

  fireEvent.click(screen.getByRole('dialog'));

  expect(handleClose).not.toHaveBeenCalled();
});

test('Modal calls onClose when the close button is clicked', () => {
  const handleClose = vi.fn();
  render(
    <Modal open onClose={handleClose} title="Title">
      Body
    </Modal>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(handleClose).toHaveBeenCalledTimes(1);
});

test('Modal locks body scroll while open and restores it on close', () => {
  const { rerender } = render(
    <Modal open onClose={() => {}} title="Title">
      Body
    </Modal>,
  );

  expect(document.body.style.overflow).toBe('hidden');

  rerender(
    <Modal open={false} onClose={() => {}} title="Title">
      Body
    </Modal>,
  );

  expect(document.body.style.overflow).toBe('');
});

test('Modal restores focus to the previously focused element on close', () => {
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();
  expect(trigger).toHaveFocus();

  const { rerender } = render(
    <Modal open={false} onClose={() => {}} title="Title">
      Body
    </Modal>,
  );

  rerender(
    <Modal open onClose={() => {}} title="Title">
      Body
    </Modal>,
  );
  expect(screen.getByRole('dialog')).toHaveFocus();

  rerender(
    <Modal open={false} onClose={() => {}} title="Title">
      Body
    </Modal>,
  );

  expect(trigger).toHaveFocus();
  document.body.removeChild(trigger);
});
