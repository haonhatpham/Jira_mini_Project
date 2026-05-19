export const API_PATHS = {
  PRODUCTS: {
    LIST: "/api/products",
    BY_ID: (id: number | string) => `/api/products/${id}`,
  },
  AUTH: {
    USERS: "/api/users",
  },
} as const;
