import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIdempotencyKey } from "../api/idempotency";
import { CART_QUANTITY } from "../configs/cart.config";
import { APP_ROUTES } from "../configs/routes.config";
import { useAsyncAction } from "./useAsyncAction";
import { productService } from "../services/product.service";
import { selectAddToCart, useCartStore } from "../stores/cartStore";
import { selectShowToast, useToastStore } from "../stores/toastStore";
import type { Product } from "../types";

interface ProductDetailActions {
  addSelectedQuantity: () => void;
  deleteError: string | null;
  deleteProduct: () => Promise<void>;
  deleteStatus: "idle" | "loading" | "error" | "data";
  decreaseQuantity: () => void;
  goToCartAfterAdd: () => void;
  increaseQuantity: () => void;
  isDeleting: boolean;
  isOptimisticallyDeleted: boolean;
  quantity: number;
}

export function useProductDetailActions(
  product: Product | null,
): ProductDetailActions {
  const navigate = useNavigate();
  const addToCart = useCartStore(selectAddToCart);
  const showToast = useToastStore(selectShowToast);
  const [quantity, setQuantity] = useState<number>(CART_QUANTITY.DEFAULT);
  const [isOptimisticallyDeleted, setIsOptimisticallyDeleted] = useState(false);
  const deleteIdempotencyKeyRef = useRef(createIdempotencyKey());
  const deleteAction = useAsyncAction<[number, string], void>((
    productId,
    idempotencyKey,
  ) =>
    productService.deleteProduct(productId, { idempotencyKey }),
  );

  const addSelectedQuantity = () => {
    if (product) {
      addToCart(product, quantity);
      showToast({
        title: "Added to cart",
        description: `${quantity} x ${product.name}`,
        variant: "success",
      });
    }
  };

  const goToCartAfterAdd = () => {
    addSelectedQuantity();
    navigate(APP_ROUTES.CART);
  };

  const deleteProduct = async () => {
    if (!product || !window.confirm(`Delete "${product.name}"?`)) {
      return;
    }

    deleteAction.reset();
    setIsOptimisticallyDeleted(true);

    try {
      await deleteAction.execute(product.id, deleteIdempotencyKeyRef.current);
      deleteIdempotencyKeyRef.current = createIdempotencyKey();
      showToast({
        title: "Product deleted",
        description: product.name,
        variant: "success",
      });
      navigate(APP_ROUTES.HOME, { replace: true });
    } catch {
      setIsOptimisticallyDeleted(false);
      showToast({
        title: "Delete failed",
        description: product.name,
        variant: "error",
      });
    }
  };

  return {
    addSelectedQuantity,
    deleteError: deleteAction.error,
    deleteProduct,
    deleteStatus: deleteAction.status,
    decreaseQuantity: () => updateQuantity(setQuantity, -CART_QUANTITY.STEP),
    goToCartAfterAdd,
    increaseQuantity: () => updateQuantity(setQuantity, CART_QUANTITY.STEP),
    isDeleting: deleteAction.isLoading,
    isOptimisticallyDeleted,
    quantity,
  };
}

function updateQuantity(
  setQuantity: (updater: (value: number) => number) => void,
  step: number,
): void {
  setQuantity((value) => Math.max(CART_QUANTITY.MIN_SELECTABLE, value + step));
}
