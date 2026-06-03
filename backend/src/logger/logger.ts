/**
 * File logger hien tai boc cac ham console de cac module import thong nhat.
 */
export const logger = {
  info: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
} as const;
