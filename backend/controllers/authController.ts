/**
 * File controller cho auth: nhan request dang ky/dang nhap va tra HTTP response.
 */
import type { Request, RequestHandler, Response } from "express";
import { HttpStatus } from "../constants/httpStatus.js";
import * as authService from "../services/authService.js";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../schemas/authSchemas.js";
import type { LoginResponse, LogoutResponse } from "../types/auth.js";
import type { PublicUser } from "../types/user.js";
import { catchErrors } from "../utils/catchErrors.js";

/**
 * Xu ly dang ky user moi va tra public user khi tao thanh cong.
 */
export const register: RequestHandler<
  Record<string, never>,
  PublicUser,
  RegisterCredentials
> = catchErrors(
  async (
    req: Request<Record<string, never>, PublicUser, RegisterCredentials>,
    res: Response<PublicUser>,
  ): Promise<void> => {
    const user = await authService.register(req.body);
    res.status(HttpStatus.CREATED).json(user);
  },
);

/**
 * Xu ly dang nhap, tra JWT va thong tin role khi credentials hop le.
 */
export const login: RequestHandler<
  Record<string, never>,
  LoginResponse,
  LoginCredentials
> = catchErrors(
  async (
    req: Request<Record<string, never>, LoginResponse, LoginCredentials>,
    res: Response<LoginResponse>,
  ): Promise<void> => {
    const result = await authService.login(req.body);
    res.status(HttpStatus.OK).json(result);
  },
);

/**
 * Xu ly dang xuat stateless JWT va tra message de frontend xoa local token.
 */
export const logout: RequestHandler<
  Record<string, never>,
  LogoutResponse
> = catchErrors((_req, res: Response<LogoutResponse>): void => {
  res.status(HttpStatus.OK).json(authService.logout());
});
