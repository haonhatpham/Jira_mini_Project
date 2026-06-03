/**
 * HTTP response/error types. These are created by controllers/middleware, not runtime-validated.
 */
import type { HttpStatusType } from "../constants/httpStatus.js";

export type ValidationErrors = Record<string, string>;

export type MessageResponse = {
  message: string;
};

export type ErrorResponse = {
  status: HttpStatusType;
  code: string;
  message: string;
  details?: unknown;
  stack?: string | undefined;
};
