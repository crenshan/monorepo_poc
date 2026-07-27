import { test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Avatar } from './Avatar'
import styles from './Avatar.module.css'

test('Avatar shows initials from a two-word name when no src is given', () => {
  render(<Avatar name="Ada Lovelace" />)

  expect(screen.getByText('AL')).toBeInTheDocument()
})

test('Avatar shows a single initial for a one-word name', () => {
  render(<Avatar name="Cher" />)

  expect(screen.getByText('C')).toBeInTheDocument()
})

test('Avatar renders an image when src is given', () => {
  const { container } = render(<Avatar name="Ada Lovelace" src="/ada.png" />)

  const img = container.querySelector('img')
  expect(img).toHaveAttribute('src', '/ada.png')
  expect(img).toHaveAttribute('alt', 'Ada Lovelace')
})

test('Avatar falls back to initials if the image fails to load', () => {
  const { container } = render(<Avatar name="Ada Lovelace" src="/broken.png" />)

  fireEvent.error(container.querySelector('img')!)

  expect(screen.getByText('AL')).toBeInTheDocument()
  expect(container.querySelector('img')).not.toBeInTheDocument()
})

test('Avatar applies the requested size class', () => {
  const { container } = render(<Avatar name="Ada Lovelace" size="lg" />)

  expect(container.querySelector(`.${styles['ds-avatar']}`)).toHaveClass(styles['ds-avatar--lg'])
})

test('Avatar forwards standard span props', () => {
  render(<Avatar name="Ada Lovelace" data-testid="avatar" />)

  expect(screen.getByTestId('avatar')).toBeInTheDocument()
})
