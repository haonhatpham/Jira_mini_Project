import { Search } from "lucide-react";
import type { CategoryOption } from "../../../types";
import type { ProductFiltersState, SortOption } from "../dashboard.types";
import styles from "../DashboardPage.module.css";

interface ProductFiltersProps {
  categories: CategoryOption[];
  filters: ProductFiltersState;
  sortOptions: SortOption[];
}

export default function ProductFilters({
  categories,
  filters,
  sortOptions,
}: ProductFiltersProps) {
  return (
    <div className={styles.filters} aria-label="Product filters">
      <select
        value={filters.category}
        onChange={(event) => filters.setCategory(event.target.value)}
        aria-label="Filter by category"
      >
        <option value="">None</option>
        {categories.map((productCategory) => (
          <option key={productCategory.id} value={productCategory.name}>
            {productCategory.name}
          </option>
        ))}
      </select>

      <label className={styles.filterSearch} htmlFor="dashboard-search">
        <Search aria-hidden="true" className={styles.searchIcon} />
        <input
          id="dashboard-search"
          value={filters.search}
          onChange={(event) => filters.setSearch(event.target.value)}
          placeholder="Search..."
        />
      </label>

      <select
        value={filters.sortIndex}
        onChange={(event) => filters.setSortIndex(Number(event.target.value))}
        aria-label="Sort products"
      >
        {sortOptions.map((option, index) => (
          <option key={`${option.sort}-${option.order}`} value={index}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0"
        value={filters.minPrice}
        onChange={(event) => filters.setMinPrice(event.target.value)}
        placeholder="Min price"
        aria-label="Minimum price"
      />
      <input
        type="number"
        min="0"
        value={filters.maxPrice}
        onChange={(event) => filters.setMaxPrice(event.target.value)}
        placeholder="Max price"
        aria-label="Maximum price"
      />
    </div>
  );
}
