import { useCallback } from "react";
import { PRODUCT_VALIDATION } from "../configs/validation.config";
import { productService } from "../services/product.service";
import type { AsyncStatus, Product } from "../types";
import { useFetch } from "./useFetch";

interface UseProductDetailResult {
  status: AsyncStatus;
  product: Product | null;
  error: string | null;
  retry: () => void;
}

export function useProductDetail(productId?: string): UseProductDetailResult {
  const id = parseProductId(productId);
  const isValidId = id !== null;
  const { data, error, refetch, status } = useFetch<Product>(
    ["product", id ?? "invalid"],
    (signal) => {
      if (id === null) {
        return Promise.reject(new Error("Invalid product id"));
      }

      return productService.getProductById(id, { signal });
    },
    { enabled: isValidId },
  );
  const retry = useCallback(() => {
    if (isValidId) {
      void refetch();
    }
  }, [isValidId, refetch]);

  return {
    status: isValidId ? status : "empty",
    product: data,
    error: isValidId ? error : null,
    retry,
  };
}

function parseProductId(productId?: string): number | null {
  const id = Number(productId);

  if (!productId || !Number.isInteger(id) || id < PRODUCT_VALIDATION.ID_MIN) {
    return null;
  }

  return id;
}
