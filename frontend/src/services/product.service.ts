import api from "../api/axiosInstance";
import { API_PATHS } from "../api/paths";
import type { Product, ProductFormValues } from "../types";
import { parseTagsInput } from "../utils/product.util";

function mapFormToApiBody(form: ProductFormValues): Omit<Product, "id"> {
  return {
    name: form.name.trim(),
    description: form.desc.trim(),
    price: Number(form.price),
    category: form.category,
    tags: parseTagsInput(form.tags),
    imageUrl: form.imageUrl.trim(),
  };
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get<Product[]>(API_PATHS.PRODUCTS.LIST);
    return data;
  },

  async getProductById(id: number | string): Promise<Product> {
    const { data } = await api.get<Product>(API_PATHS.PRODUCTS.BY_ID(id));
    return data;
  },

  async createProduct(form: ProductFormValues): Promise<Product> {
    const body = mapFormToApiBody(form);
    const { data } = await api.post<Product>(API_PATHS.PRODUCTS.LIST, body);
    return data;
  },
};
