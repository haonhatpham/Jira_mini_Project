import { useCallback, useEffect, useRef, useState } from "react";
import { productService } from "../services/product.service";
import { getErrorMessage } from "../utils/apiError.util";

export function useProductDetail(productId) {
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const cleanupRef = useRef(() => {});

  const load = useCallback(() => {
    cleanupRef.current();
    let isActive = true;
    cleanupRef.current = () => {
      isActive = false;
    };

    const id = Number(productId);
    if (!productId || Number.isNaN(id)) {
      queueMicrotask(() => {
        if (!isActive) return;
        setStatus("error");
        setError("Invalid product id");
      });
      return;
    }

    queueMicrotask(() => {
      if (!isActive) return;
      setStatus("loading");
      setError(null);
      setProduct(null);
    });

    productService
      .getProductById(id)
      .then((data) => {
        if (!isActive) return;
        setProduct(data);
        setStatus("data");
      })
      .catch((err) => {
        if (!isActive) return;
        if (err?.response?.status === 404) {
          setError("Product not found");
        } else {
          setError(getErrorMessage(err));
        }
        setStatus("error");
      });
  }, [productId]);

  useEffect(() => {
    load();
    return () => cleanupRef.current();
  }, [load]);

  const retry = useCallback(() => {
    load();
  }, [load]);

  return { status, product, error, retry };
}
