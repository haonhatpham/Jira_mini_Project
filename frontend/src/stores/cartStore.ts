import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  CART_QUANTITY,
  CART_STORAGE_KEY,
  CART_SUM_INITIAL,
} from "../configs/cart.config";
import type { CartItem, CartProduct } from "../types";

export interface CartStoreState {
  items: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
}

const calculateCartCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, CART_SUM_INITIAL);

const calculateCartTotal = (items: CartItem[]): number =>
  items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    CART_SUM_INITIAL,
  );

export const selectCartItems = (state: CartStoreState): CartItem[] =>
  state.items;
export const selectCartCount = (state: CartStoreState): number =>
  calculateCartCount(state.items);
export const selectCartTotal = (state: CartStoreState): number =>
  calculateCartTotal(state.items);
export const selectAddToCart = (
  state: CartStoreState,
): CartStoreState["addToCart"] => state.addToCart;
export const selectRemoveFromCart = (
  state: CartStoreState,
): CartStoreState["removeFromCart"] => state.removeFromCart;
export const selectUpdateCartQuantity = (
  state: CartStoreState,
): CartStoreState["updateQuantity"] => state.updateQuantity;
export const selectClearCart = (
  state: CartStoreState,
): CartStoreState["clearCart"] => state.clearCart;

export const useCartStore = create<CartStoreState>()(
  devtools(
    persist(
      (set) => ({
        items: [],

        addToCart: (product, quantity = CART_QUANTITY.DEFAULT) =>
          set(
            (state) => {
              const quantityToAdd = normalizeQuantity(quantity);
              const existingItem = state.items.find(
                (item) => item.id === product.id,
              );

              if (existingItem) {
                return {
                  items: state.items.map((item) =>
                    item.id === product.id
                      ? {
                          ...item,
                          quantity: item.quantity + quantityToAdd,
                        }
                      : item,
                  ),
                };
              }

              return {
                items: [
                  ...state.items,
                  { ...product, quantity: quantityToAdd },
                ],
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
              if (newQuantity <= CART_QUANTITY.EMPTY) {
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

function normalizeQuantity(quantity: number): number {
  return Math.max(CART_QUANTITY.DEFAULT, Math.floor(quantity));
}
