export const BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "";

export const API_PATHS = {
  PRODUCTS: {
    LIST: "/api/products",
    CREATE: "/api/products",
    DETAIL: (id: number | string) => `/api/products/${id}`,
    UPDATE: (id: number | string) => `/api/products/${id}`,
    DELETE: (id: number | string) => `/api/products/${id}`,
  },
  CATEGORIES: {
    LIST: "/api/categories",
  },
  TAGS: {
    LIST: "/api/tags",
  },
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
    USERS: "/api/users",
  },
} as const;
