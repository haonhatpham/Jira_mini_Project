/**
 * Middleware authorization: chi cho phep cac role duoc khai bao truy cap route.
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ForbiddenException, UnauthorizedException } from "../exceptions/index.js";
import type { UserRole } from "../schemas/authSchemas.js";
import type { MessageResponse } from "../types/http.js";

/**
 * Tao middleware so sanh req.user.role voi whitelist role duoc phep.
 */
export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req: Request, _res: Response<MessageResponse>, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedException("Authentication token is required."));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenException("You do not have permission to access this resource."));
      return;
    }

    next();
  };
}
