import { z } from "zod";
import {
  PRODUCT_VALIDATION,
  REQUIRED_TEXT_LENGTH,
} from "../configs/validation.config";
import { productCategorySchema, productInputSchema } from "./product.schema";

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(REQUIRED_TEXT_LENGTH, "Name is required")
    .min(
      PRODUCT_VALIDATION.NAME_MIN_LENGTH,
      "Name must be at least 2 characters",
    ),
  desc: z
    .string()
    .trim()
    .min(REQUIRED_TEXT_LENGTH, "Description is required")
    .min(
      PRODUCT_VALIDATION.DESCRIPTION_MIN_LENGTH,
      "Description must be at least 10 characters",
    ),
  price: z
    .string()
    .trim()
    .min(REQUIRED_TEXT_LENGTH, "Price is required")
    .refine(
      (value) =>
        Number.isFinite(Number(value)) &&
        Number(value) >= PRODUCT_VALIDATION.MIN_PRICE,
      "Price must be a number greater than or equal to 0",
    ),
  category: z
    .union([productCategorySchema, z.literal("")])
    .refine((value) => value !== "", "Please select a category"),
  tags: z
    .array(z.string())
    .transform((tags) => tags.map((tag) => tag.trim()).filter(Boolean)),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isUrl(value),
      "Enter a valid URL (https://...)",
    ),
});

export const productFormPayloadSchema = productFormSchema.transform((form) =>
  productInputSchema.parse({
    name: form.name,
    description: form.desc,
    price: form.price,
    category: form.category,
    tags: form.tags,
    imageUrl: form.imageUrl,
  }),
);

export type ProductFormValues = z.input<typeof productFormSchema>;
export type ProductFormFieldName = keyof ProductFormValues;

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
