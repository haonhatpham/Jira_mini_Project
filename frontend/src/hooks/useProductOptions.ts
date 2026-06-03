import { productMetaService } from "../services/productMeta.service";
import type { AsyncStatus, CategoryOption, TagOption } from "../types";
import { useFetch } from "./useFetch";

interface ProductOptionsData {
  categories: CategoryOption[];
  tags: TagOption[];
}

interface UseProductOptionsResult extends ProductOptionsData {
  error: string | null;
  refetch: () => Promise<ProductOptionsData | undefined>;
  status: AsyncStatus;
}

export function useProductOptions(): UseProductOptionsResult {
  const { data, error, refetch, status } = useFetch<ProductOptionsData>(
    ["product-options"],
    async (signal) => {
      const requestOptions = { signal };
      const [categories, tags] = await Promise.all([
        productMetaService.getCategories(requestOptions),
        productMetaService.getTags(requestOptions),
      ]);

      return { categories, tags };
    },
  );

  return {
    categories: data?.categories ?? [],
    error,
    refetch,
    status,
    tags: data?.tags ?? [],
  };
}
