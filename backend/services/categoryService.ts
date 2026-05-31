/**
 * File service category: boc model category de giu controller khong cham truc tiep database.
 */
import * as categoryModel from "../models/categoryModel.js";
import type { NamedEntity } from "../types/option.js";

/**
 * Lay danh sach category san pham tu database.
 */
export async function getCategories(): Promise<NamedEntity[]> {
  return categoryModel.findAllCategories();
}
