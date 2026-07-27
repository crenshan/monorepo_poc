import { test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'

const testLabel = 'Test Label'

test('Input should be rendered', () => {
  render(<Input label={testLabel} />)

  expect(screen.getByRole('textbox')).toBeInTheDocument()
})

test('Input associates the label with the input', () => {
  render(<Input label={testLabel} />)

  expect(screen.getByLabelText(testLabel)).toBe(screen.getByRole('textbox'))
})

test('Input forwards standard input props', () => {
  render(<Input label={testLabel} placeholder="Enter text" disabled type="email" />)

  const input = screen.getByPlaceholderText('Enter text')
  expect(input).toBeDisabled()
  expect(input).toHaveAttribute('type', 'email')
})

test('Input displays a controlled value', () => {
  render(<Input label={testLabel} value="hello" onChange={() => {}} />)

  expect(screen.getByRole('textbox')).toHaveValue('hello')
})

test('Input calls onChange when the user types', () => {
  const handleChange = vi.fn()
  render(<Input label={testLabel} onChange={handleChange} />)

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'world' } })

  expect(handleChange).toHaveBeenCalledTimes(1)
})

test('Input has no error styling or message by default', () => {
  render(<Input label={testLabel} />)

  expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('Input shows an error message and marks the input invalid', () => {
  render(<Input label={testLabel} error="This field is required" />)

  const input = screen.getByRole('textbox')
  const errorMessage = screen.getByRole('alert')

  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(errorMessage).toHaveTextContent('This field is required')
  expect(input).toHaveAttribute('aria-describedby', errorMessage.id)
})
