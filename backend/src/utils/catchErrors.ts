/**
 * Wrap async Express handlers and forward thrown errors to exceptionMiddleware.
 */
import type { RequestHandler } from "express";

/**
 * Giu controller gon: handler chi can throw, catchErrors se goi next(err).
 */
export function catchErrors<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  return async (req, res, next): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
