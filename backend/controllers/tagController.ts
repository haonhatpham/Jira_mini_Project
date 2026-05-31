/**
 * File controller cho tag: tra danh sach tag tu service.
 */
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus.js";
import * as tagService from "../services/tagService.js";
import type { NamedEntity } from "../types/option.js";

/**
 * Lay toan bo tag va tra ve HTTP 200.
 */
export async function getTags(
  _req: Request,
  res: Response<NamedEntity[]>,
  next: NextFunction,
): Promise<void> {
  try {
    const tags = await tagService.getTags();
    res.status(HttpStatus.OK).json(tags);
  } catch (err) {
    next(err);
  }
}
