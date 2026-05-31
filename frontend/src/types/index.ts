import type {
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from "../schemas/auth.schema";
import type {
  ProductCategory,
  ProductInput,
  ProductSortField,
  SortOrder,
} from "../schemas/product.schema";

export type AsyncStatus = "idle" | "loading" | "error" | "empty" | "data";

export type {
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from "../schemas/auth.schema";

export type {
  ProductCategory,
  ProductInput as ProductPayload,
  ProductSortField,
  SortOrder,
} from "../schemas/product.schema";

export type LoginResponse = {
  token: string;
  expiresIn: string;
  username: string;
  role: UserRole;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type RegisterResponse = AuthUser;

export type Product = ProductInput & {
  id: number;
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
    sort: ProductSortField;
    order: SortOrder;
  };
  filters: {
    search: string;
    category: ProductCategory | "";
    minPrice: number | null;
    maxPrice: number | null;
  };
};

export type CategoryOption = {
  id: number;
  name: ProductCategory;
};

export type TagOption = {
  id: number;
  name: string;
};

export type {
  ProductFormFieldName,
  ProductFormValues,
} from "../schemas/productForm.schema";

export interface ApiErrorBody {
  status?: number;
  code?: string;
  message?: string;
  details?: unknown;
  errors?: Record<string, string>;
  stack?: string;
}

export type ApiResponse<T> = {
  data: T;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
};

export type ApiErrorResponse = {
  status: number;
  message: string;
  code: string;
};

export type CartProduct = Pick<
  Product,
  "id" | "name" | "price" | "category" | "imageUrl"
>;

export interface CartItem extends CartProduct {
  quantity: number;
}
