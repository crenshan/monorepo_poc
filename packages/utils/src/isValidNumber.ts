export const isValidNumber = (value: string): boolean =>
  value.trim() !== '' && !Number.isNaN(Number(value));
