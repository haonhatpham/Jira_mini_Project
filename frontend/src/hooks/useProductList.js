import { useCallback, useEffect, useRef, useState } from "react";
import { productService } from "../services/product.service";
import { getErrorMessage } from "../utils/apiError.util";

export function useProductList() {
  const [status, setStatus] = useState("loading");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const cleanupRef = useRef(() => {});

  const load = useCallback(() => {
    cleanupRef.current();
    let isActive = true;
    cleanupRef.current = () => {
      isActive = false;
    };

    queueMicrotask(() => {
      if (!isActive) return;
      setStatus("loading");
      setError(null);
    });

    productService
      .getProducts()
      .then((data) => {
        if (!isActive) return;
        if (data.length === 0) {
          setProducts([]);
          setStatus("empty");
        } else {
          setProducts(data);
          setStatus("data");
        }
      })
      .catch((err) => {
        if (!isActive) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    load();
    return () => cleanupRef.current();
  }, [load]);

  const retry = useCallback(() => {
    load();
  }, [load]);

  return { status, products, error, retry };
}
