import { createContext } from 'react';
import type { ReactNode } from 'react';

import type { AlertVariant } from '../Alert';

/** Options passed to `toast()` (from {@link useToast}) describing a single toast notification. */
export interface ToastOptions {
  /** Optional heading rendered as the toast's title. */
  title?: ReactNode;
  /** Main message content of the toast. */
  description: ReactNode;
  /** Visual style of the toast, forwarded to the underlying `Alert`. Defaults to `Alert`'s default variant. */
  variant?: AlertVariant;
  /** Milliseconds before the toast auto-dismisses. Pass 0 to require a manual dismiss. Defaults to 5000. */
  duration?: number;
}

/** The value returned by {@link useToast} — currently just the `toast()` function. */
export interface ToastContextValue {
  /** Queues a new toast with the given options. Resolves immediately; the toast is dismissed automatically after `duration` ms (or manually if `duration` is 0). */
  toast: (options: ToastOptions) => void;
}

/**
 * React context that carries the `toast()` function used to queue toast notifications.
 * Provided by `ToastProvider` and typically consumed via the `useToast()` hook rather
 * than read directly from this context.
 *
 * @category Feedback
 */
export const ToastContext = createContext<ToastContextValue | null>(null);
