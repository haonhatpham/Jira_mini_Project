/**
 * File schema pagination: validate/coerce query page, limit va sort/order dung chung.
 */
import { z } from "zod";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * Chuyen chuoi rong tu query string thanh undefined de schema dung default.
 */
export const emptyStringToUndefined = (value: unknown): unknown => (
  value === "" ? undefined : value
);

export const pageQuerySchema = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().positive().default(DEFAULT_PAGE),
);

export const limitQuerySchema = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().positive().default(DEFAULT_LIMIT),
).transform((limit) => Math.min(limit, MAX_LIMIT));

export const sortDirectionQuerySchema = z.preprocess(
  (value) => {
    if (value === "") {
      return undefined;
    }

    return typeof value === "string" ? value.toLowerCase() : value;
  },
  z.enum(["asc", "desc"]).default("asc"),
);

/**
 * Tao schema cho field sort voi default tuy tung resource, vi moi list co default khac nhau.
 */
export function createSortPropertyQuerySchema(defaultSort: string) {
  return z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1).default(defaultSort),
  );
}
