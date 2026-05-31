import api from "../api/axiosInstance";
import { API_PATHS } from "../api/paths";
import {
  createRequestConfig,
  createSignalConfig,
  type RequestOptions,
} from "../api/requestConfig";
import { productFormPayloadSchema } from "../schemas/productForm.schema";
import type {
  Product,
  ProductCategory,
  ProductFormValues,
  ProductListResponse,
  ProductPayload,
  ProductSortField,
  SortOrder,
} from "../types";

export interface ProductListQuery {
  page?: number;
  limit?: number;
  sort?: ProductSortField;
  order?: SortOrder;
  search?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
}

function mapFormToApiBody(form: ProductFormValues): ProductPayload {
  return productFormPayloadSchema.parse(form);
}

export const productService = {
  async getProducts(
    params?: ProductListQuery,
    options: RequestOptions = {},
  ): Promise<ProductListResponse> {
    const { data } = await api.get<ProductListResponse>(
      API_PATHS.PRODUCTS.LIST,
      createRequestConfig(params, options),
    );
    return data;
  },

  async getProductById(
    id: number | string,
    options: RequestOptions = {},
  ): Promise<Product> {
    const { data } = await api.get<Product>(
      API_PATHS.PRODUCTS.DETAIL(id),
      createSignalConfig(options),
    );
    return data;
  },

  async createProduct(
    form: ProductFormValues,
    options: RequestOptions = {},
  ): Promise<Product> {
    const body = mapFormToApiBody(form);
    const { data } = await api.post<Product>(
      API_PATHS.PRODUCTS.CREATE,
      body,
      createSignalConfig(options),
    );
    return data;
  },

  async updateProduct(
    id: number | string,
    form: ProductFormValues,
    options: RequestOptions = {},
  ): Promise<Product> {
    const body = mapFormToApiBody(form);
    const { data } = await api.put<Product>(
      API_PATHS.PRODUCTS.UPDATE(id),
      body,
      createSignalConfig(options),
    );
    return data;
  },

  async deleteProduct(
    id: number | string,
    options: RequestOptions = {},
  ): Promise<void> {
    await api.delete(API_PATHS.PRODUCTS.DELETE(id), createSignalConfig(options));
  },
};
