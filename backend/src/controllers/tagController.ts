/**
 * File controller cho tag: tra danh sach tag tu service.
 */
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus.js";
import * as tagService from "../services/tagService.js";
import type { NamedEntityRequest } from "../schemas/metaSchemas.js";
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

/**
 * Tao tag moi va tra HTTP 201.
 */
export async function createTag(
  req: Request,
  res: Response<NamedEntity>,
  next: NextFunction,
): Promise<void> {
  try {
    const tag = await tagService.createTag(req.body as NamedEntityRequest);
    res.status(HttpStatus.CREATED).json(tag);
  } catch (err) {
    next(err);
  }
}

/**
 * Doi ten tag theo id.
 */
export async function updateTag(
  req: Request,
  res: Response<NamedEntity>,
  next: NextFunction,
): Promise<void> {
  try {
    const tag = await tagService.updateTag(
      Number(req.params.id),
      req.body as NamedEntityRequest,
    );
    res.status(HttpStatus.OK).json(tag);
  } catch (err) {
    next(err);
  }
}

/**
 * Xoa tag theo id neu khong co product dang dung.
 */
export async function deleteTag(
  req: Request,
  res: Response<void>,
  next: NextFunction,
): Promise<void> {
  try {
    await tagService.deleteTag(Number(req.params.id));
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}
