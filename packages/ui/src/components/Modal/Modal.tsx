import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '../Icon';
import styles from './Modal.module.css';

export interface ModalProps {
  /** Whether the modal is currently visible. When `false`, the component renders nothing. */
  open: boolean;
  /** Called when the user requests to close the modal (Escape key, backdrop click, or the close button). */
  onClose: () => void;
  /** Heading content rendered in the modal header and linked to the dialog via `aria-labelledby`. */
  title: ReactNode;
  /** Body content rendered inside the dialog. */
  children: ReactNode;
}

/**
 * A focused, modal dialog rendered into `document.body` via a portal, used to interrupt the
 * user with a task or piece of information that requires their attention before continuing.
 *
 * @category Overlay
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Delete item">
 *   Are you sure you want to delete this item?
 * </Modal>
 * ```
 *
 * Accessibility: the dialog exposes `role="dialog"`, `aria-modal="true"`, and
 * `aria-labelledby` pointing at the title. While open, focus moves to the dialog, the
 * Escape key calls `onClose`, and background scrolling is locked by setting
 * `document.body.style.overflow`. On close/unmount, focus is restored to whatever
 * element was focused before the modal opened. Note that focus is moved to the dialog
 * container only — focus is not trapped/cycled within the dialog's interactive children.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the dialog, lock body scroll, and listen for Escape while open.
  // Cleanup (on close or unmount) restores focus to whatever triggered the modal.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles['ds-modal__overlay']} onClick={onClose}>
      <div
        ref={dialogRef}
        className={styles['ds-modal']}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles['ds-modal__header']}>
          <h2 id={titleId} className={styles['ds-modal__title']}>
            {title}
          </h2>
          <button
            type="button"
            className={styles['ds-modal__close']}
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="x" size="sm" />
          </button>
        </div>
        <div className={styles['ds-modal__body']}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
