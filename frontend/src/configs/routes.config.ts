export const APP_ROUTES = {
  CART: "/cart",
  DASHBOARD: "/dashboard",
  HOME: "/",
  LOGIN: "/login",
  NEW_PRODUCT: "/products/new",
  PRODUCT_DETAIL: "/products/:id",
  PRODUCT_EDIT: "/products/:id/edit",
  REGISTER: "/register",
  productDetail: (id: number | string): string => `/products/${id}`,
  productEdit: (id: number | string): string => `/products/${id}/edit`,
} as const;
