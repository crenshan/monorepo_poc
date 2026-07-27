import { createContext } from 'react'
import type { ReactNode } from 'react'

import type { AlertVariant } from '../Alert'

export interface ToastOptions {
  title?: ReactNode
  description: ReactNode
  variant?: AlertVariant
  // Milliseconds before the toast auto-dismisses. Pass 0 to require a manual dismiss.
  duration?: number
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
