export type AsyncStatus = "idle" | "loading" | "error" | "empty" | "data";

export type ProductCategory = "Phone" | "Tablet" | "Accessory" | "Other";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  tags: string[];
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  sort: {
    sort: string;
    order: "asc" | "desc";
  };
  filters: {
    search: string;
    category: string;
    minPrice: number | null;
    maxPrice: number | null;
  };
}

export interface ProductFormValues {
  name: string;
  desc: string;
  price: string | number;
  category: ProductCategory;
  tags?: string;
  imageUrl: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  password: string;
  token: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface ApiErrorBody {
  message?: string;
}
