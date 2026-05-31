import { z } from "zod";
import {
  PRODUCT_VALIDATION,
  REQUIRED_TEXT_LENGTH,
} from "../configs/validation.config";

export const PRODUCT_CATEGORIES = [
  "Phone",
  "Tablet",
  "Accessory",
  "Other",
] as const;
export const PRODUCT_SORT_FIELDS = [
  "id",
  "name",
  "price",
  "category",
  "createdAt",
  "updatedAt",
] as const;

export const productCategorySchema = z.enum(PRODUCT_CATEGORIES);
export const productSortFieldSchema = z.enum(PRODUCT_SORT_FIELDS);
export const sortOrderSchema = z.enum(["asc", "desc"]);

export const productInputSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(REQUIRED_TEXT_LENGTH, "Name is required.")
    .min(
      PRODUCT_VALIDATION.NAME_MIN_LENGTH,
      "name must be at least 2 characters.",
    ),
  description: z
    .string()
    .trim()
    .min(REQUIRED_TEXT_LENGTH, "Description is required.")
    .min(
      PRODUCT_VALIDATION.DESCRIPTION_MIN_LENGTH,
      "description must be at least 10 characters.",
    ),
  price: z.preprocess(
    (value) =>
      value === undefined || value === null || value === ""
        ? value
        : Number(value),
    z.number().finite().min(PRODUCT_VALIDATION.MIN_PRICE),
  ),
  category: productCategorySchema,
  tags: z
    .array(z.string())
    .optional()
    .default([])
    .transform((tags) => tags.map((tag) => tag.trim()).filter(Boolean)),
  imageUrl: z.preprocess(
    (value) => (value === null || value === "" ? undefined : value),
    z.string().trim().optional().default(""),
  ),
});

export type ProductCategory = z.infer<typeof productCategorySchema>;
export type ProductSortField = z.infer<typeof productSortFieldSchema>;
export type SortOrder = z.infer<typeof sortOrderSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
