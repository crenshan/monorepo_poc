import { test, expect, vi } from 'vitest'
import { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToastProvider } from './Toast'
import { useToast } from './useToast'
import alertStyles from '../Alert/Alert.module.css'

function Harness() {
  const { toast } = useToast()
  return (
    <button onClick={() => toast({ description: 'Saved successfully', variant: 'success' })}>
      Show toast
    </button>
  )
}

test('useToast throws when used outside a ToastProvider', () => {
  function Broken() {
    useToast()
    return null
  }

  // Suppress the expected React error-boundary console noise for this negative test.
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  expect(() => render(<Broken />)).toThrow('useToast must be used within a ToastProvider')
  consoleSpy.mockRestore()
})

test('toast() renders a toast with the given description and variant', () => {
  render(
    <ToastProvider>
      <Harness />
    </ToastProvider>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Show toast' }))

  const toastText = screen.getByText('Saved successfully')
  expect(toastText.closest(`.${alertStyles['ds-alert']}`)).toHaveClass(
    alertStyles['ds-alert--success'],
  )
})

test('a toast can be dismissed manually', () => {
  render(
    <ToastProvider>
      <Harness />
    </ToastProvider>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Show toast' }))
  expect(screen.getByText('Saved successfully')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
  expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument()
})

test('a toast auto-dismisses after its duration', () => {
  vi.useFakeTimers()

  function TimedHarness() {
    const { toast } = useToast()
    return (
      <button onClick={() => toast({ description: 'Bye soon', duration: 1000 })}>Show</button>
    )
  }

  render(
    <ToastProvider>
      <TimedHarness />
    </ToastProvider>,
  )

  act(() => {
    fireEvent.click(screen.getByRole('button', { name: 'Show' }))
  })
  expect(screen.getByText('Bye soon')).toBeInTheDocument()

  act(() => {
    vi.advanceTimersByTime(1000)
  })
  expect(screen.queryByText('Bye soon')).not.toBeInTheDocument()

  vi.useRealTimers()
})

test('a toast with duration 0 does not auto-dismiss', () => {
  vi.useFakeTimers()

  function PersistentHarness() {
    const { toast } = useToast()
    return <button onClick={() => toast({ description: 'Stays put', duration: 0 })}>Show</button>
  }

  render(
    <ToastProvider>
      <PersistentHarness />
    </ToastProvider>,
  )

  act(() => {
    fireEvent.click(screen.getByRole('button', { name: 'Show' }))
  })

  act(() => {
    vi.advanceTimersByTime(10000)
  })
  expect(screen.getByText('Stays put')).toBeInTheDocument()

  vi.useRealTimers()
})

test('multiple toasts stack', () => {
  function MultiHarness() {
    const { toast } = useToast()
    return (
      <button
        onClick={() => {
          toast({ description: 'First' })
          toast({ description: 'Second' })
        }}
      >
        Show both
      </button>
    )
  }

  render(
    <ToastProvider>
      <MultiHarness />
    </ToastProvider>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Show both' }))

  expect(screen.getByText('First')).toBeInTheDocument()
  expect(screen.getByText('Second')).toBeInTheDocument()
})
