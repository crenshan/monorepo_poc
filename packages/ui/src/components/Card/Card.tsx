import type { HTMLAttributes, ReactNode } from 'react'

import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, ...props }: CardProps) {
  return (
    <div className={styles['ds-card']} {...props}>
      {children}
    </div>
  )
}
