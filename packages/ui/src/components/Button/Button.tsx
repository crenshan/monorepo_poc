import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button className={styles['ds-button']} {...props}>
      {children}
    </button>
  )
}
