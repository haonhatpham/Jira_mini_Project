/**
 * File route tag: khai bao endpoint doc va quan ly tag.
 */
import express from "express";
import { memoryCache } from "../cache/memoryCache.js";
import * as tagController from "../controllers/tagController.js";
import { idempotency } from "../idempotency/index.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { requireRole } from "../middleware/requireRole.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createNamedEntityRequestSchema,
  deleteNamedEntityRequestSchema,
  updateNamedEntityRequestSchema,
} from "../schemas/metaSchemas.js";

const router = express.Router();
const tagMutationIdempotency = idempotency(memoryCache);

// Lay tat ca tag san pham.
router.get("/", tagController.getTags);

// Tao tag moi, chi admin.
router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  validateRequest(createNamedEntityRequestSchema),
  tagMutationIdempotency,
  tagController.createTag,
);

// Doi ten tag, chi admin.
router.put(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateRequest(updateNamedEntityRequestSchema),
  tagMutationIdempotency,
  tagController.updateTag,
);

// Xoa tag chua duoc product su dung, chi admin.
router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateRequest(deleteNamedEntityRequestSchema),
  tagMutationIdempotency,
  tagController.deleteTag,
);

export default router;
