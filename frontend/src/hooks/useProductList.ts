import { useCallback, useEffect, useState } from "react";
import { PRODUCT_PAGINATION } from "../configs/pagination.config";
import {
  productService,
  type ProductListQuery,
} from "../services/product.service";
import type {
  AsyncStatus,
  Product,
  ProductListResponse,
  ProductPagination,
} from "../types";
import { useFetch } from "./useFetch";

interface UseProductListResult {
  status: AsyncStatus;
  products: Product[];
  pagination: ProductPagination | null;
  error: string | null;
  retry: () => void;
  goToPage: (page: number) => void;
}

type ProductListOptions = Omit<ProductListQuery, "page" | "limit"> & {
  pageLimit?: number;
};

export function useProductList(
  options: ProductListOptions = {},
): UseProductListResult {
  const {
    category,
    maxPrice,
    minPrice,
    order = "desc",
    pageLimit = PRODUCT_PAGINATION.PAGE_LIMIT,
    search,
    sort = "createdAt",
  } = options;
  const [page, setPage] = useState<number>(PRODUCT_PAGINATION.INITIAL_PAGE);

  useEffect(() => {
    setPage(PRODUCT_PAGINATION.INITIAL_PAGE);
  }, [category, maxPrice, minPrice, order, search, sort]);

  const {
    data,
    error,
    refetch,
    status: fetchStatus,
  } = useFetch<ProductListResponse>(
    [
      "products",
      page,
      pageLimit,
      search ?? "",
      category ?? "",
      minPrice ?? "",
      maxPrice ?? "",
      sort,
      order,
    ],
    (signal) => {
      const params: ProductListQuery = {
        page,
        limit: pageLimit,
        sort,
        order,
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
        ...(minPrice !== undefined ? { minPrice } : {}),
        ...(maxPrice !== undefined ? { maxPrice } : {}),
      };

      return productService.getProducts(params, { signal });
    },
  );

  const products = data?.data ?? [];
  const pagination = data?.pagination ?? null;
  const status = getProductListStatus(fetchStatus, products);

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const goToPage = useCallback(
    (targetPage: number) => {
      setPage(() => {
        const lastPage = pagination?.totalPages ?? targetPage;

        return Math.min(
          Math.max(PRODUCT_PAGINATION.INITIAL_PAGE, targetPage),
          lastPage,
        );
      });
    },
    [pagination],
  );

  return {
    status,
    products,
    pagination,
    error,
    retry,
    goToPage,
  };
}

function getProductListStatus(
  fetchStatus: AsyncStatus,
  products: Product[],
): AsyncStatus {
  if (
    fetchStatus === "data" &&
    products.length === PRODUCT_PAGINATION.EMPTY_COUNT
  ) {
    return "empty";
  }

  return fetchStatus;
}
