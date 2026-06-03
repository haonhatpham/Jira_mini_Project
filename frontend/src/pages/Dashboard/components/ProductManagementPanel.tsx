import AsyncState from "../../../components/common/AsyncState/AsyncState";
import Pagination from "../../../components/common/Pagination/Pagination";
import type {
  AsyncStatus,
  CategoryOption,
  Product,
  ProductPagination,
} from "../../../types";
import type { ProductFiltersState, SortOption } from "../dashboard.types";
import styles from "../DashboardPage.module.css";
import ProductFilters from "./ProductFilters";
import ProductSummary from "./ProductSummary";
import ProductTable from "./ProductTable";

interface ProductManagementPanelProps {
  categories: CategoryOption[];
  deleteError: string | null;
  deletingProductId: number | null;
  error: string | null;
  filters: ProductFiltersState;
  goToPage: (page: number) => void;
  onDeleteProduct: (product: Product) => void;
  pagination: ProductPagination | null;
  products: Product[];
  retry: () => void;
  sortOptions: SortOption[];
  status: AsyncStatus;
}

export default function ProductManagementPanel({
  categories,
  deleteError,
  deletingProductId,
  error,
  filters,
  goToPage,
  onDeleteProduct,
  pagination,
  products,
  retry,
  sortOptions,
  status,
}: ProductManagementPanelProps) {
  return (
    <>
      <ProductSummary
        categoryCount={categories.length}
        pagination={pagination}
        productCount={products.length}
      />

      <ProductFilters
        categories={categories}
        filters={filters}
        sortOptions={sortOptions}
      />

      {deleteError && (
        <p className={styles.errorMessage} role="alert">
          {deleteError}
        </p>
      )}

      <AsyncState
        status={status}
        error={error}
        onRetry={retry}
        emptyMessage="No products found."
        loadingMessage="Loading dashboard..."
      >
        <ProductTable
          deletingProductId={deletingProductId}
          onDeleteProduct={onDeleteProduct}
          products={products}
        />
      </AsyncState>

      {status === "data" && pagination && (
        <Pagination
          ariaLabel="Dashboard pages"
          onChange={goToPage}
          page={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </>
  );
}
