import { test, expect } from 'vitest';
import { isValidNumber } from './isValidNumber';

test('isValidNumber(10) should return true', () => {
  expect(isValidNumber('10')).toBe(true);
});

test('isValidNumber(-3.5) should return true', () => {
  expect(isValidNumber('-3.5')).toBe(true);
});

test('isValidNumber(abc) should return false', () => {
  expect(isValidNumber('abc')).toBe(false);
});

test('isValidNumber(empty string) should return false', () => {
  expect(isValidNumber('')).toBe(false);
});

test('isValidNumber(whitespace only) should return false', () => {
  expect(isValidNumber('   ')).toBe(false);
});
