/**
 * File service product: xu ly business logic, pagination va loi nghiep vu cua product.
 */
import * as productModel from "../models/productModel.js";
import { Page } from "../pagination/page.js";
import { NotFoundException } from "../exceptions/index.js";
import {
  type ProductQueryOptions,
  type ProductRequest,
} from "../schemas/productSchemas.js";
import type { Product, ProductListResponse } from "../types/product.js";

/**
 * Lay danh sach product va tinh metadata pagination/sort/filter cho response.
 */
export async function getProducts(options: ProductQueryOptions): Promise<ProductListResponse> {
  const { data, total } = await productModel.findProducts(options);
  const page = Page.of(data, total, options.pageable);
  const sort = options.pageable.sort.first ?? { direction: "asc" as const, property: "id" };

  return {
    data: page.items,
    pagination: {
      total: page.totalItems,
      page: page.page,
      limit: page.limit,
      totalPages: page.totalPages,
      hasNextPage: page.page < page.totalPages,
      hasPrevPage: page.page > 1,
    },
    sort: {
      sort: sort.property,
      order: sort.direction,
    },
    filters: options.filters,
  };
}

/**
 * Lay mot product theo id, neu khong co thi nem loi 404.
 */
export async function getProductById(productId: number): Promise<Product> {
  const product = await productModel.findProductById(productId);

  if (!product) {
    throw new NotFoundException("Product not found");
  }

  return product;
}

/**
 * Tao product moi thong qua model.
 */
export async function createProduct(productRequest: ProductRequest): Promise<Product> {
  return productModel.createProduct(productRequest);
}

/**
 * Thay the product hien co, neu model khong tim thay thi nem loi 404.
 */
export async function replaceProduct(productId: number, productRequest: ProductRequest): Promise<Product> {
  const product = await productModel.replaceProduct(productId, productRequest);

  if (!product) {
    throw new NotFoundException("Product not found");
  }

  return product;
}

/**
 * Xoa product theo id; delete duoc xem la idempotent nen product vang mat khong phai loi.
 */
export async function deleteProduct(productId: number): Promise<void> {
  await productModel.deleteProduct(productId);
}
