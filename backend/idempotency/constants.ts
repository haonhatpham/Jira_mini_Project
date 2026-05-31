/**
 * File hang so idempotency dung chung cho middleware va helper.
 */
export const IDEMPOTENCY_HEADER = "Idempotency-Key" as const;
export const IDEMPOTENCY_PREFIX = "idempotency" as const;
export const DEFAULT_IDEMPOTENCY_TTL_SECONDS = 60;
