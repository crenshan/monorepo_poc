import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { Icon } from '../Icon'
import styles from './Modal.module.css'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  // Focus the dialog, lock body scroll, and listen for Escape while open.
  // Cleanup (on close or unmount) restores focus to whatever triggered the modal.
  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

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
  )
}
