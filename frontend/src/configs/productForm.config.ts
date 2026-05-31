import type { ProductFormValues } from "../types";

export const PRODUCT_FORM_DEFAULT_VALUES = {
  name: "",
  desc: "",
  price: "",
  category: "",
  tags: [],
  imageUrl: "",
} satisfies ProductFormValues;

export const PRODUCT_FORM_RULES = {
  DESCRIPTION_ROWS: 3,
  PRICE_STEP: "0.01",
  PRICE_MIN: "0",
};
