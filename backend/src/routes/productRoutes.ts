/**
 * File route product: khai bao endpoint product kem validate, auth va idempotency.
 */
import express from "express";
import { memoryCache } from "../cache/memoryCache.js";
import { idempotency } from "../idempotency/index.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { requireRole } from "../middleware/requireRole.js";
import { validateRequest } from "../middleware/validateRequest.js";
import * as productController from "../controllers/productController.js";
import {
  createProductRequestSchema,
  productIdRequestSchema,
  productListRequestSchema,
  replaceProductRequestSchema,
} from "../schemas/productRequestSchemas.js";

const router = express.Router();
const productMutationIdempotency = idempotency(memoryCache);

// Lay danh sach product public voi query da validate.
router.get("/", validateRequest(productListRequestSchema), productController.getProducts);

// Lay chi tiet product public theo id da validate.
router.get("/:id", validateRequest(productIdRequestSchema), productController.getProductById);

// Tao product moi, chi admin va bat buoc co Idempotency-Key.
router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  validateRequest(createProductRequestSchema),
  productMutationIdempotency,
  productController.createProduct,
);

// Thay the product, chi admin va co idempotency de retry an toan.
router.put(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateRequest(replaceProductRequestSchema),
  productMutationIdempotency,
  productController.replaceProduct,
);

// Xoa product, chi admin va co idempotency de retry an toan.
router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateRequest(productIdRequestSchema),
  productMutationIdempotency,
  productController.deleteProduct,
);

export default router;
