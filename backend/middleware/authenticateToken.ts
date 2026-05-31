/**
 * Middleware authenticate: doc Bearer token, verify JWT va gan req.user.
 */
import type { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/index.js";
import type { MessageResponse } from "../types/http.js";
import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Xac thuc Authorization Bearer token va gan user vao request neu hop le.
 */
export function authenticateToken(
  req: Request,
  _res: Response<MessageResponse>,
  next: NextFunction,
): void {
  const token = getBearerToken(req);

  if (!token) {
    next(new UnauthorizedException("Authentication token is required."));
    return;
  }

  const result = verifyAccessToken(token);
  if (!result.user) {
    next(new UnauthorizedException("Authentication token is invalid or expired."));
    return;
  }

  req.user = result.user;
  next();
}

/**
 * Lay token tu header Authorization: Bearer <token>.
 */
function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  const [scheme, token] = typeof authHeader === "string"
    ? authHeader.split(" ")
    : [];

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}
