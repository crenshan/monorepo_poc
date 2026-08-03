import { useContext } from 'react';

import { ToastContext } from './ToastContext';
import type { ToastContextValue } from './ToastContext';

/**
 * Reads the toast API from context, giving components a `toast()` function to queue
 * toast notifications. Must be called from a descendant of `ToastProvider`.
 *
 * @category Feedback
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const { toast } = useToast();
 *   return (
 *     <button onClick={() => toast({ title: 'Saved', description: 'Your changes were saved.' })}>
 *       Save
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns A {@link ToastContextValue} containing the `toast` function used to queue notifications.
 * @throws {Error} If called outside of a `ToastProvider`.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
