/**
 * File service auth: xu ly dang ky/dang nhap voi input da duoc route validate.
 */
import bcrypt from "bcryptjs";
import {
  JWT_EXPIRES_IN,
  PASSWORD_SALT_ROUNDS,
} from "../config/auth.js";
import {
  ConflictException,
  UnauthorizedException,
} from "../exceptions/index.js";
import * as userModel from "../models/userModel.js";
import {
  type LoginCredentials,
  type RegisterCredentials,
} from "../schemas/authSchemas.js";
import type { LoginResponse, LogoutResponse } from "../types/auth.js";
import {
  toPublicUser,
  type PublicUser,
  type UserRecord,
} from "../types/user.js";
import { signAccessToken } from "../utils/jwt.js";

const DEFAULT_ROLE = "customer";

/**
 * Tao loi xung dot du lieu, hien dung khi username/email da ton tai.
 */
function createConflictError(message: string): Error {
  return new ConflictException(message);
}

/**
 * Tao loi dang nhap that bai ma khong tiet lo username hay password sai.
 */
function createUnauthorizedError(): Error {
  return new UnauthorizedException("Invalid username or password.");
}

/**
 * Ky JWT access token voi subject la user id va role de middleware phan quyen.
 */
function createAccessToken(user: UserRecord): string {
  return signAccessToken({
    id: user.id,
    role: user.role,
  });
}

/**
 * Dong goi JWT va thong tin can thiet cho response dang nhap.
 */
function createAuthResponse(user: UserRecord): LoginResponse {
  return {
    token: createAccessToken(user),
    expiresIn: JWT_EXPIRES_IN,
    username: user.username,
    role: user.role,
  };
}

/**
 * Dang ky customer moi, hash password va chi tra ve public user.
 */
export async function register(input: RegisterCredentials): Promise<PublicUser> {
  const existingUsername = await userModel.findUserByUsername(input.username);
  if (existingUsername) {
    throw createConflictError("Username already exists.");
  }

  const existingEmail = await userModel.findUserByEmail(input.email);
  if (existingEmail) {
    throw createConflictError("Email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const user = await userModel.createUser({
    email: input.email,
    username: input.username,
    password: passwordHash,
    role: DEFAULT_ROLE,
  });

  return toPublicUser(user);
}

/**
 * Dang nhap bang username/password va tra JWT neu hop le.
 */
export async function login(input: LoginCredentials): Promise<LoginResponse> {
  const user = await userModel.findUserByUsername(input.username);
  if (!user) {
    throw createUnauthorizedError();
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw createUnauthorizedError();
  }

  return createAuthResponse(user);
}

/**
 * Dang xuat dang stateless JWT: backend chi tra response thanh cong, frontend xoa token localStorage.
 */
export function logout(): LogoutResponse {
  return {
    message: "Logout successful",
  };
}
