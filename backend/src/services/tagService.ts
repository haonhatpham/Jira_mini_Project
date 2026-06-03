/**
 * File service tag: boc model tag de controller chi lam viec voi service.
 */
import * as tagModel from "../models/tagModel.js";
import type { NamedEntityRequest } from "../schemas/metaSchemas.js";
import type { NamedEntity } from "../types/option.js";

/**
 * Lay danh sach tag san pham tu database.
 */
export async function getTags(): Promise<NamedEntity[]> {
  return tagModel.findAllTags();
}

/**
 * Tao tag moi.
 */
export async function createTag(
  request: NamedEntityRequest,
): Promise<NamedEntity> {
  return tagModel.createTag(request.name);
}

/**
 * Doi ten tag.
 */
export async function updateTag(
  tagId: number,
  request: NamedEntityRequest,
): Promise<NamedEntity> {
  return tagModel.updateTag(tagId, request.name);
}

/**
 * Xoa tag neu chua duoc product su dung.
 */
export async function deleteTag(tagId: number): Promise<void> {
  await tagModel.deleteTag(tagId);
}
