import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const CART_STORAGE_KEY = "jira-mini-cart";

const calculateCartCount = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

const calculateCartTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectCartItems = (state) => state.items;
export const selectCartCount = (state) => calculateCartCount(state.items);
export const selectCartTotal = (state) => calculateCartTotal(state.items);
export const selectAddToCart = (state) => state.addToCart;
export const selectRemoveFromCart = (state) => state.removeFromCart;
export const selectUpdateCartQuantity = (state) => state.updateQuantity;
export const selectClearCart = (state) => state.clearCart;

export const useCartStore = create(
  devtools(
    persist(
      (set) => ({
        items: [],

        addToCart: (product) =>
          set(
            (state) => {
              const existingItem = state.items.find(
                (item) => item.id === product.id,
              );

              if (existingItem) {
                return {
                  items: state.items.map((item) =>
                    item.id === product.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item,
                  ),
                };
              }

              return {
                items: [...state.items, { ...product, quantity: 1 }],
              };
            },
            false,
            "cart/addToCart",
          ),

        removeFromCart: (productId) =>
          set(
            (state) => ({
              items: state.items.filter((item) => item.id !== productId),
            }),
            false,
            "cart/removeFromCart",
          ),

        updateQuantity: (productId, newQuantity) =>
          set(
            (state) => {
              if (newQuantity <= 0) {
                return {
                  items: state.items.filter((item) => item.id !== productId),
                };
              }

              return {
                items: state.items.map((item) =>
                  item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item,
                ),
              };
            },
            false,
            "cart/updateQuantity",
          ),

        clearCart: () => set({ items: [] }, false, "cart/clearCart"),
      }),
      {
        name: CART_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ items: state.items }),
      },
    ),
    { enabled: true, name: "CartStore" },
  ),
);
