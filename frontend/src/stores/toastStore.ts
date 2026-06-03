import { create } from "zustand";

export type ToastVariant = "error" | "info" | "success" | "warning";

export type ToastMessage = {
  description?: string;
  id: string;
  title: string;
  variant: ToastVariant;
};

type CreateToastInput = Omit<ToastMessage, "id">;

interface ToastStoreState {
  dismissToast: (id: string) => void;
  showToast: (toast: CreateToastInput) => string;
  toasts: ToastMessage[];
}

const TOAST_LIMIT = 4;

export const selectToasts = (state: ToastStoreState): ToastMessage[] =>
  state.toasts;
export const selectShowToast = (
  state: ToastStoreState,
): ToastStoreState["showToast"] => state.showToast;
export const selectDismissToast = (
  state: ToastStoreState,
): ToastStoreState["dismissToast"] => state.dismissToast;

export const useToastStore = create<ToastStoreState>()((set) => ({
  toasts: [],

  showToast: (toast) => {
    const id = createToastId();

    set((state) => ({
      toasts: [{ ...toast, id }, ...state.toasts].slice(0, TOAST_LIMIT),
    }));

    return id;
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

function createToastId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
