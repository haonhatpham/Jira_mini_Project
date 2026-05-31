/**
 * File schema product: validate product request, filter, sort va pagination input.
 */
import { z } from "zod";
import type { Pageable } from "../pagination/pageable.js";

export const ProductCategorySchema = z.string().trim().min(1, "Category is required.");
export const SortOrderSchema = z.enum(["asc", "desc"]);

/**
 * Schema body client gui len khi tao/cap nhat product.
 */
export const ProductRequestSchema = z.strictObject({
  name: z.string().trim().min(1, "Name is required.").min(2, "name must be at least 2 characters."),
  description: z.string().trim().min(1, "Description is required.").min(10, "description must be at least 10 characters."),
  price: z.preprocess(
    (value) => (value === undefined || value === null || value === "" ? value : Number(value)),
    z.number().finite().min(0),
  ),
  category: ProductCategorySchema,
  tags: z.array(z.string()).optional().default([]).transform((tags) => (
    tags.map((tag) => tag.trim()).filter(Boolean)
  )),
  imageUrl: z.preprocess(
    (value) => (value === null || value === "" ? undefined : value),
    z.string().trim().optional().default(""),
  ),
});

export type ProductRequest = z.infer<typeof ProductRequestSchema>;

export const ProductFiltersSchema = z.object({
  search: z.string(),
  category: z.union([ProductCategorySchema, z.literal("")]),
  minPrice: z.number().nullable(),
  maxPrice: z.number().nullable(),
});

export type ProductFilters = z.infer<typeof ProductFiltersSchema>;

export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type SortOrder = z.infer<typeof SortOrderSchema>;
export type ProductSortField = string;
export type ProductQueryOptions = {
  filters: ProductFilters;
  pageable: Pageable;
};
