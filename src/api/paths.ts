export const API_PATHS = {
  PRODUCTS: {
    LIST: "/products",
    BY_ID: (id: number | string) => `/products/${id}`,
  },
  AUTH: {
    USERS: "/users",
  },
} as const;
