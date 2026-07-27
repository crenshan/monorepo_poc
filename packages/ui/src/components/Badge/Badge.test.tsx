import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'
import styles from './Badge.module.css'

test('Badge should be rendered', () => {
  render(<Badge>New</Badge>)

  expect(screen.getByText('New')).toBeInTheDocument()
})

test('Badge defaults to the neutral variant', () => {
  render(<Badge>New</Badge>)

  expect(screen.getByText('New')).toHaveClass(styles['ds-badge'], styles['ds-badge--neutral'])
})

test('Badge applies the requested variant class', () => {
  render(<Badge variant="danger">Failed</Badge>)

  expect(screen.getByText('Failed')).toHaveClass(styles['ds-badge'], styles['ds-badge--danger'])
})

test('Badge forwards standard span props', () => {
  render(
    <Badge variant="success" data-testid="badge">
      Done
    </Badge>,
  )

  expect(screen.getByTestId('badge')).toHaveClass(styles['ds-badge--success'])
})
