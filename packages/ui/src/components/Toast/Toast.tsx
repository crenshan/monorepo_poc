import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { Alert } from '../Alert'
import { ToastContext } from './ToastContext'
import type { ToastOptions } from './ToastContext'
import styles from './Toast.module.css'

interface ToastItem extends ToastOptions {
  id: string
}

const DEFAULT_DURATION = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback((options: ToastOptions) => {
    nextId.current += 1
    const id = String(nextId.current)
    setToasts((current) => [...current, { id, ...options }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className={styles['ds-toast-viewport']} aria-live="polite">
          {toasts.map(({ id, title, description, variant, duration }) => (
            <ToastItem
              key={id}
              id={id}
              title={title}
              description={description}
              variant={variant}
              duration={duration}
              onDismiss={dismiss}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

interface ToastItemProps extends ToastOptions {
  id: string
  onDismiss: (id: string) => void
}

function ToastItem({
  id,
  title,
  description,
  variant,
  duration = DEFAULT_DURATION,
  onDismiss,
}: ToastItemProps) {
  useEffect(() => {
    if (duration <= 0) return

    const timer = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <Alert variant={variant} title={title} onDismiss={() => onDismiss(id)}>
      {description}
    </Alert>
  )
}
