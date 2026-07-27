import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'
import styles from './Card.module.css'

test('Card should be rendered', () => {
  render(<Card>Hello</Card>)

  expect(screen.getByText(/Hello/)).toBeInTheDocument()
})

test('Card applies the ds-card class', () => {
  render(<Card>Hello</Card>)

  expect(screen.getByText(/Hello/)).toHaveClass(styles['ds-card'])
})

test('Card forwards standard div props', () => {
  render(
    <Card data-testid="card" aria-label="Test card">
      Hello
    </Card>,
  )

  const card = screen.getByTestId('card')
  expect(card).toHaveAttribute('aria-label', 'Test card')
})
