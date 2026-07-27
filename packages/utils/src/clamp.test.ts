import { test, expect } from 'vitest'
import { clamp } from './clamp'

test('clamp(5, 0, 10) should return 5', () => {
  expect(clamp(5, 0, 10)).toBe(5)
})

test('clamp(-5, 0, 10) should return 0', () => {
  expect(clamp(-5, 0, 10)).toBe(0)
})

test('clamp(15, 0, 10) should return 10', () => {
  expect(clamp(15, 0, 10)).toBe(10)
})

test('clamp(5, 5, 5) should return 5', () => {
  expect(clamp(5, 5, 5)).toBe(5)
})
