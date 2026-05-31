/**
 * File controller cho user: tra danh sach user public cho route admin.
 */
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus.js";
import * as userService from "../services/userService.js";
import type { PublicUser } from "../types/user.js";

/**
 * Lay danh sach user da an password hash va tra ve HTTP 200.
 */
export async function getUsers(
  _req: Request,
  res: Response<PublicUser[]>,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await userService.getUsers();
    res.status(HttpStatus.OK).json(users);
  } catch (err) {
    next(err);
  }
}
