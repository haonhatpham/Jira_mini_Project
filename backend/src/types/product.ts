/**
 * Product response types. Response shape is created by model/service mappers.
 */
import type {
  ProductFilters,
  SortOrder,
} from "../schemas/productSchemas.js";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ProductListResponse = {
  data: Product[];
  pagination: ProductPagination;
  sort: {
    sort: string;
    order: SortOrder;
  };
  filters: ProductFilters;
};

export type ProductListResult = {
  data: Product[];
  total: number;
};
