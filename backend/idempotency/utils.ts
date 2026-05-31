/**
 * File helper idempotency: tao fingerprint on dinh va hash cache key.
 */
import crypto from "crypto";
import type { Request } from "express";
import { IDEMPOTENCY_PREFIX } from "./constants.js";

type StableRecord = Record<string, unknown>;

/**
 * Sap xep key object de JSON stringify tao ra chuoi on dinh giua cac request tuong duong.
 */
function normalizeForStableStringify(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeForStableStringify);
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  return Object.keys(value as StableRecord)
    .sort()
    .reduce<StableRecord>((acc, key) => {
      acc[key] = normalizeForStableStringify((value as StableRecord)[key]);
      return acc;
  }, {});
}

/**
 * Stringify du lieu sau khi da normalize thu tu key.
 */
function stableStringify(value: unknown): string {
  return JSON.stringify(normalizeForStableStringify(value));
}

/**
 * Bam SHA-256 input da stringify va them prefix de dung lam cache key.
 */
export function hashKey(input: unknown): string {
  const digest = crypto
    .createHash("sha256")
    .update(stableStringify(input))
    .digest("hex");

  return `${IDEMPOTENCY_PREFIX}:${digest}`;
}

/**
 * Tao fingerprint request tu method, URL, query, body, user va Idempotency-Key.
 */
export function buildFingerprint(req: Request, key: string): unknown {
  return {
    body: req.body,
    key,
    method: req.method.toUpperCase(),
    query: req.query,
    url: req.originalUrl,
    user: req.user ? { id: req.user.id, role: req.user.role } : null,
  };
}
