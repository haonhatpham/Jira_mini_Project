/**
 * File middleware validate request: parse body/params/query bang Zod truoc controller.
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type ZodIssue, type ZodType } from "zod";
import { ValidationException } from "../exceptions/index.js";
import type { ValidationErrors } from "../types/http.js";

type RequestParts = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

type MutableRequestParts = {
  body: unknown;
  params: unknown;
  query: unknown;
};

/**
 * Tao Express middleware validate request parts va ghi lai du lieu da parse vao req.
 */
export function validateRequest<T extends RequestParts>(
  schema: ZodType<T>,
): RequestHandler {
  // Middleware async parse cac request part truoc khi controller doc req.
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      applyParsedRequestParts(req, parsed);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ValidationException("Validation failed", formatZodIssues(err.issues)));
        return;
      }

      next(err);
    }
  };
}

/**
 * Ghi cac phan request da parse vao req neu schema co khai bao phan do.
 */
function applyParsedRequestParts(req: Request, parsed: RequestParts): void {
  if (hasOwn(parsed, "body")) {
    setRequestPart(req, "body", parsed.body);
  }

  if (hasOwn(parsed, "params")) {
    setRequestPart(req, "params", parsed.params);
  }

  if (hasOwn(parsed, "query")) {
    setRequestPart(req, "query", parsed.query);
  }
}

/**
 * Ghi de body/params/query bang Object.defineProperty de Express request cho phep gan lai.
 */
function setRequestPart<K extends keyof MutableRequestParts>(
  req: Request,
  key: K,
  value: MutableRequestParts[K],
): void {
  Object.defineProperty(req, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

/**
 * Chuyen Zod issues thanh object field -> message de client hien thi loi gon hon.
 */
function formatZodIssues(issues: ZodIssue[]): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const issue of issues) {
    if (issue.code === "unrecognized_keys") {
      issue.keys.forEach((key) => {
        errors[key] = "Field is not allowed.";
      });
      continue;
    }

    const field = getIssueField(issue);
    if (errors[field] === undefined) {
      errors[field] = issue.message;
    }
  }

  return Object.keys(errors).length > 0
    ? errors
    : { request: "Request validation failed." };
}

/**
 * Lay ten field loi tu Zod path, bo tien to body/params/query khi co.
 */
function getIssueField(issue: ZodIssue): string {
  const path = issue.path.map(String);
  const requestPart = path[0];
  const fieldPath = requestPart === "body" || requestPart === "params" || requestPart === "query"
    ? path.slice(1)
    : path;

  return fieldPath.join(".") || requestPart || "request";
}

/**
 * Type guard kiem tra object co own property, giup TypeScript hieu key ton tai.
 */
function hasOwn<T extends object, K extends PropertyKey>(
  object: T,
  key: K,
): object is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(object, key);
}
