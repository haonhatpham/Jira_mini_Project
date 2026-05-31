/**
 * File controller cho product: dieu phoi request CRUD/list product sang service.
 */
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus.js";
import * as productService from "../services/productService.js";
import type {
  ProductQueryOptions,
  ProductRequest,
} from "../schemas/productSchemas.js";
import type { Product, ProductListResponse } from "../types/product.js";

/**
 * Lay danh sach product theo query da validate gom pagination, sort va filter.
 */
export async function getProducts(
  req: Request,
  res: Response<ProductListResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const products = await productService.getProducts(req.query as unknown as ProductQueryOptions);
    res.status(HttpStatus.OK).json(products);
  } catch (err) {
    next(err);
  }
}

/**
 * Lay chi tiet mot product theo id tren URL params.
 */
export async function getProductById(
  req: Request,
  res: Response<Product>,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    res.status(HttpStatus.OK).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * Tao product moi tu body da validate va tra HTTP 201.
 */
export async function createProduct(
  req: Request,
  res: Response<Product>,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await productService.createProduct(req.body as ProductRequest);
    res.status(HttpStatus.CREATED).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * Thay the toan bo product theo id bang body moi da validate.
 */
export async function replaceProduct(
  req: Request,
  res: Response<Product>,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await productService.replaceProduct(Number(req.params.id), req.body as ProductRequest);
    res.status(HttpStatus.OK).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * Xoa product theo id va tra HTTP 204 neu request duoc xu ly.
 */
export async function deleteProduct(
  req: Request,
  res: Response<void>,
  next: NextFunction,
): Promise<void> {
  try {
    await productService.deleteProduct(Number(req.params.id));
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}
