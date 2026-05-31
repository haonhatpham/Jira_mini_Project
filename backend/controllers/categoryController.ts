/**
 * File controller cho category: tra danh sach category tu service.
 */
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus.js";
import * as categoryService from "../services/categoryService.js";
import type { NamedEntity } from "../types/option.js";

/**
 * Lay toan bo category va tra ve HTTP 200.
 */
export async function getCategories(
  _req: Request,
  res: Response<NamedEntity[]>,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await categoryService.getCategories();
    res.status(HttpStatus.OK).json(categories);
  } catch (err) {
    next(err);
  }
}
