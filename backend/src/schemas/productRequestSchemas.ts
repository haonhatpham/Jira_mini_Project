/**
 * File schema request product: validate/coerce query, params va body bang Zod.
 */
import { z } from "zod";
import { Pageable } from "../pagination/pageable.js";
import {
  createSortPropertyQuerySchema,
  emptyStringToUndefined,
  limitQuerySchema,
  pageQuerySchema,
  sortDirectionQuerySchema,
} from "../pagination/paginationSchemas.js";
import { Sort } from "../pagination/sort.js";
import {
  ProductCategorySchema,
  ProductRequestSchema,
  type ProductQueryOptions,
} from "./productSchemas.js";

const DEFAULT_PRODUCT_SORT = "id";
const sortQuerySchema = createSortPropertyQuerySchema(DEFAULT_PRODUCT_SORT);

// Query category: cho phep rong de bieu thi khong filter category; category hop le se do DB kiem tra.
const categoryQuerySchema = z.preprocess(
  emptyStringToUndefined,
  z.union([ProductCategorySchema, z.literal("")]).default(""),
);

// Query price: chuoi rong/undefined thanh null, con lai coerce sang number >= 0.
const optionalPriceQuerySchema = z.preprocess(
  (value) => (value === undefined || value === "" ? null : value),
  z.coerce.number().finite().min(0).nullable(),
);

// Schema query list product, gom validate range gia va transform sang ProductQueryOptions.
const productListRawQuerySchema = z.object({
  page: pageQuerySchema,
  limit: limitQuerySchema,
  sort: sortQuerySchema,
  order: sortDirectionQuerySchema,
  search: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().optional().default(""),
  ),
  category: categoryQuerySchema,
  minPrice: optionalPriceQuerySchema,
  maxPrice: optionalPriceQuerySchema,
}).superRefine((query, ctx) => {
  if (query.minPrice !== null && query.maxPrice !== null && query.minPrice > query.maxPrice) {
    ctx.addIssue({
      code: "custom",
      path: ["priceRange"],
      message: "minPrice must be less than or equal to maxPrice.",
    });
  }
}).transform((query): ProductQueryOptions => ({
  pageable: Pageable.of(query.page, query.limit, Sort.by(query.sort, query.order)),
  filters: {
    search: query.search,
    category: query.category,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
  },
}));

// Params id: chi chap nhan positive integer string.
const productIdParamsSchema = z.object({
  id: z.string().regex(/^[1-9]\d*$/, "Invalid product id"),
});

// Request schema cho GET /api/products.
export const productListRequestSchema = z.object({
  query: productListRawQuerySchema,
});

// Request schema cho route co :id.
export const productIdRequestSchema = z.object({
  params: productIdParamsSchema,
});

// Request schema cho POST product.
export const createProductRequestSchema = z.object({
  body: ProductRequestSchema,
});

// Request schema cho PUT product.
export const replaceProductRequestSchema = z.object({
  body: ProductRequestSchema,
  params: productIdParamsSchema,
});
