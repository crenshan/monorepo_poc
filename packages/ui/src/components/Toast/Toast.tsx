import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Alert } from '../Alert';
import { ToastContext } from './ToastContext';
import type { ToastOptions } from './ToastContext';
import styles from './Toast.module.css';

interface ToastItem extends ToastOptions {
  id: string;
}

const DEFAULT_DURATION = 5000;

/**
 * Provides the `toast()` API (via {@link ToastContext}) to its subtree and renders the
 * queued toasts into a portal at `document.body`. Wrap your application (or the relevant
 * subtree) once near the root; descendants then call `useToast()` to queue notifications.
 *
 * @category Feedback
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 *
 * Accessibility: the toast viewport is rendered with `aria-live="polite"`, so assistive
 * technology announces new toasts without stealing focus. Each toast auto-dismisses after
 * its `duration` (see {@link ToastOptions}) and can also be dismissed manually via the
 * underlying `Alert`'s dismiss control.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    nextId.current += 1;
    const id = String(nextId.current);
    setToasts((current) => [...current, { id, ...options }]);
  }, []);

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
  );
}

interface ToastItemProps extends ToastOptions {
  id: string;
  onDismiss: (id: string) => void;
}

// Internal: renders a single queued toast as an `Alert` and schedules its auto-dismiss timer.
function ToastItem({
  id,
  title,
  description,
  variant,
  duration = DEFAULT_DURATION,
  onDismiss,
}: ToastItemProps) {
  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <Alert variant={variant} title={title} onDismiss={() => onDismiss(id)}>
      {description}
    </Alert>
  );
}
