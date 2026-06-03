import type {
  CategoryOption,
  ProductSortField,
  SortOrder,
  TagOption,
} from "../../types";

export type DashboardView = "products" | "metadata";

export type SortOption = {
  label: string;
  sort: ProductSortField;
  order: SortOrder;
};

export type ProductFilterState = {
  category: string;
  maxPrice: string;
  minPrice: string;
  search: string;
  sortIndex: number;
};

export type ProductFilterActions = {
  setCategory: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setMinPrice: (value: string) => void;
  setSearch: (value: string) => void;
  setSortIndex: (value: number) => void;
};

export type ProductFiltersState = ProductFilterState & ProductFilterActions;

export type MetaKind = "category" | "tag";
export type MetaEntity = CategoryOption | TagOption;

export type EditingMeta = {
  id: number;
  kind: MetaKind;
  name: string;
};
