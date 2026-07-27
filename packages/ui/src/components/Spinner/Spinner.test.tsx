import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'
import iconStyles from '../Icon/Icon.module.css'

test('Spinner is rendered as a status region', () => {
  render(<Spinner />)

  expect(screen.getByRole('status')).toBeInTheDocument()
})

test('Spinner announces a default loading label', () => {
  render(<Spinner />)

  expect(screen.getByRole('status')).toHaveTextContent('Loading')
})

test('Spinner announces a custom label', () => {
  render(<Spinner label="Saving changes" />)

  expect(screen.getByRole('status')).toHaveTextContent('Saving changes')
})

test('Spinner renders the spinner icon', () => {
  const { container } = render(<Spinner size="lg" />)

  const svg = container.querySelector('svg')
  expect(svg).toHaveClass(iconStyles['ds-icon--lg'])
})
