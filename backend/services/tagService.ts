/**
 * File service tag: boc model tag de controller chi lam viec voi service.
 */
import * as tagModel from "../models/tagModel.js";
import type { NamedEntity } from "../types/option.js";

/**
 * Lay danh sach tag san pham tu database.
 */
export async function getTags(): Promise<NamedEntity[]> {
  return tagModel.findAllTags();
}
