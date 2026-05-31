/**
 * File augment Express Request de middleware auth co the gan req.user.
 */
import type { AuthenticatedUser } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
