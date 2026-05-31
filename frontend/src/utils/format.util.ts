const VND_LOCALE = "vi-VN";
const FALLBACK_NUMBER = 0;

export function formatVndPrice(value: number): string {
  return `${toSafeNumber(value).toLocaleString(VND_LOCALE)} VND`;
}

function toSafeNumber(value: number): number {
  return Number.isFinite(value) ? value : FALLBACK_NUMBER;
}
