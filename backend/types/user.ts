/**
 * File type user: user public, database user record va helper map user.
 */
import type { UserRole } from "../schemas/authSchemas.js";

export type PublicUser = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  token?: string | null;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Chuyen UserRecord noi bo sang PublicUser, loai bo password va format ngay ISO.
 */
export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
