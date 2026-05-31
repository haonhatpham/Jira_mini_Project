export const IDEMPOTENCY_HEADER = "Idempotency-Key" as const;

const MUTATING_HTTP_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function shouldAttachIdempotencyKey(method?: string): boolean {
  return method !== undefined
    && MUTATING_HTTP_METHODS.has(method.toUpperCase());
}

export function createIdempotencyKey(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
