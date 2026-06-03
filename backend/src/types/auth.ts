/**
 * Auth response/request-adjacent types that do not need runtime Zod validation.
 */
import type { UserRole } from "../schemas/authSchemas.js";

export type LoginResponse = {
  token: string;
  expiresIn: string;
  username: string;
  role: UserRole;
};

export type LogoutResponse = {
  message: string;
};

export type AuthenticatedUser = {
  id: number;
  role: UserRole;
};
