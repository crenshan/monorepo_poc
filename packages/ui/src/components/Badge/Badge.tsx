import type { HTMLAttributes, ReactNode } from 'react'

import styles from './Badge.module.css'

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
}

export function Badge({ children, variant = 'neutral', className, ...props }: BadgeProps) {
  const classes = [styles['ds-badge'], styles[`ds-badge--${variant}`], className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}
