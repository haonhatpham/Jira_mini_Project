/**
 * File route category: khai bao endpoint doc va quan ly category.
 */
import express from "express";
import { memoryCache } from "../cache/memoryCache.js";
import * as categoryController from "../controllers/categoryController.js";
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
const categoryMutationIdempotency = idempotency(memoryCache);

// Lay tat ca category san pham.
router.get("/", categoryController.getCategories);

// Tao category moi, chi admin.
router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  validateRequest(createNamedEntityRequestSchema),
  categoryMutationIdempotency,
  categoryController.createCategory,
);

// Doi ten category, chi admin.
router.put(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateRequest(updateNamedEntityRequestSchema),
  categoryMutationIdempotency,
  categoryController.updateCategory,
);

// Xoa category chua duoc product su dung, chi admin.
router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateRequest(deleteNamedEntityRequestSchema),
  categoryMutationIdempotency,
  categoryController.deleteCategory,
);

export default router;
