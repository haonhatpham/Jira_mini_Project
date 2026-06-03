/**
 * File controller cho category: tra danh sach category tu service.
 */
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus.js";
import * as categoryService from "../services/categoryService.js";
import type { NamedEntityRequest } from "../schemas/metaSchemas.js";
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

/**
 * Tao category moi va tra HTTP 201.
 */
export async function createCategory(
  req: Request,
  res: Response<NamedEntity>,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await categoryService.createCategory(
      req.body as NamedEntityRequest,
    );
    res.status(HttpStatus.CREATED).json(category);
  } catch (err) {
    next(err);
  }
}

/**
 * Doi ten category theo id.
 */
export async function updateCategory(
  req: Request,
  res: Response<NamedEntity>,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await categoryService.updateCategory(
      Number(req.params.id),
      req.body as NamedEntityRequest,
    );
    res.status(HttpStatus.OK).json(category);
  } catch (err) {
    next(err);
  }
}

/**
 * Xoa category theo id neu khong co product dang dung.
 */
export async function deleteCategory(
  req: Request,
  res: Response<void>,
  next: NextFunction,
): Promise<void> {
  try {
    await categoryService.deleteCategory(Number(req.params.id));
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}
