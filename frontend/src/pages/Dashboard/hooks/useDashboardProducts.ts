import { useState } from "react";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useProductList } from "../../../hooks/useProductList";
import { productService } from "../../../services/product.service";
import { selectShowToast, useToastStore } from "../../../stores/toastStore";
import type { Product } from "../../../types";
import { getErrorMessage } from "../../../utils/apiError.util";
import type { ProductFiltersState, SortOption } from "../dashboard.types";

const SORT_OPTIONS: SortOption[] = [
  {
    label: "Newest",
    sort: "createdAt",
    order: "desc",
  },
  {
    label: "Recently updated",
    sort: "updatedAt",
    order: "desc",
  },
  {
    label: "Name A-Z",
    sort: "name",
    order: "asc",
  },
  {
    label: "Price low to high",
    sort: "price",
    order: "asc",
  },
  {
    label: "Price high to low",
    sort: "price",
    order: "desc",
  },
];

const DEFAULT_SORT_OPTION = SORT_OPTIONS[0] as SortOption;
const SEARCH_DEBOUNCE_MS = 350;

export function useDashboardProducts() {
  const showToast = useToastStore(selectShowToast);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null,
  );

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const selectedSort = SORT_OPTIONS[sortIndex] ?? DEFAULT_SORT_OPTION;
  const searchQuery = debouncedSearch.trim();
  const minPriceValue = getNumericFilter(minPrice);
  const maxPriceValue = getNumericFilter(maxPrice);

  const {
    error,
    goToPage,
    pagination,
    products,
    retry,
    status,
  } = useProductList({
    order: selectedSort.order,
    sort: selectedSort.sort,
    ...(category ? { category } : {}),
    ...(searchQuery ? { search: searchQuery } : {}),
    ...(minPriceValue !== undefined ? { minPrice: minPriceValue } : {}),
    ...(maxPriceValue !== undefined ? { maxPrice: maxPriceValue } : {}),
  });

  const filters: ProductFiltersState = {
    category,
    maxPrice,
    minPrice,
    search,
    setCategory,
    setMaxPrice,
    setMinPrice,
    setSearch,
    setSortIndex,
    sortIndex,
  };

  const deleteProduct = async (product: Product): Promise<void> => {
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) {
      return;
    }

    setDeleteError(null);
    setDeletingProductId(product.id);

    try {
      await productService.deleteProduct(product.id);
      showToast({
        title: "Product deleted",
        description: product.name,
        variant: "success",
      });
      retry();
    } catch (err) {
      const message = getErrorMessage(err);
      setDeleteError(message);
      showToast({
        title: "Delete failed",
        description: message,
        variant: "error",
      });
    } finally {
      setDeletingProductId(null);
    }
  };

  return {
    clearCategory: () => setCategory(""),
    deleteError,
    deletingProductId,
    deleteProduct,
    error,
    filters,
    goToPage,
    pagination,
    products,
    retry,
    sortOptions: SORT_OPTIONS,
    status,
  };
}

function getNumericFilter(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}
