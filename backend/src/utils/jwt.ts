/**
 * Helper JWT: ky va verify access token cho auth middleware/service.
 */
import jwt, { type SignOptions } from "jsonwebtoken";
import {
  getJwtSecret,
  JWT_EXPIRES_IN,
} from "../config/auth.js";
import { isUserRole, type UserRole } from "../schemas/authSchemas.js";
import type { AuthenticatedUser } from "../types/auth.js";

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

type AuthJwtPayload = jwt.JwtPayload & {
  sub: string;
  role: UserRole;
};

type VerifyAccessTokenResult =
  | {
      error?: never;
      user: AuthenticatedUser;
    }
  | {
      error: string;
      user?: never;
    };

/**
 * Ky access token stateless, payload chi gom user id va role.
 */
export function signAccessToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: JWT_EXPIRES_IN as JwtExpiresIn,
    },
  );
}

/**
 * Verify access token va map payload hop le thanh AuthenticatedUser.
 */
export function verifyAccessToken(token: string): VerifyAccessTokenResult {
  try {
    const payload = jwt.verify(token, getJwtSecret());
    const user = toAuthenticatedUser(payload);

    if (!user) {
      return {
        error: "Invalid token",
      };
    }

    return {
      user,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Invalid token",
    };
  }
}

/**
 * Chuyen JWT payload sang user dang gan vao Express req.user.
 */
function toAuthenticatedUser(payload: string | jwt.JwtPayload): AuthenticatedUser | null {
  if (!isAuthJwtPayload(payload)) {
    return null;
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return {
    id: userId,
    role: payload.role,
  };
}

/**
 * Type guard dam bao payload JWT co sub dang string va role hop le.
 */
function isAuthJwtPayload(payload: string | jwt.JwtPayload): payload is AuthJwtPayload {
  return typeof payload === "object"
    && payload !== null
    && typeof payload.sub === "string"
    && isUserRole(payload.role);
}
