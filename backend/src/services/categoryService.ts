/**
 * File service category: boc model category de giu controller khong cham truc tiep database.
 */
import * as categoryModel from "../models/categoryModel.js";
import type { NamedEntityRequest } from "../schemas/metaSchemas.js";
import type { NamedEntity } from "../types/option.js";

/**
 * Lay danh sach category san pham tu database.
 */
export async function getCategories(): Promise<NamedEntity[]> {
  return categoryModel.findAllCategories();
}

/**
 * Tao category moi.
 */
export async function createCategory(
  request: NamedEntityRequest,
): Promise<NamedEntity> {
  return categoryModel.createCategory(request.name);
}

/**
 * Doi ten category.
 */
export async function updateCategory(
  categoryId: number,
  request: NamedEntityRequest,
): Promise<NamedEntity> {
  return categoryModel.updateCategory(categoryId, request.name);
}

/**
 * Xoa category neu chua duoc product su dung.
 */
export async function deleteCategory(categoryId: number): Promise<void> {
  await categoryModel.deleteCategory(categoryId);
}
