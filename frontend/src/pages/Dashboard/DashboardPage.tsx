import { Package, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AsyncState from "../../components/common/AsyncState/AsyncState";
import { PRODUCT_PAGINATION } from "../../configs/pagination.config";
import { APP_ROUTES } from "../../configs/routes.config";
import { PRODUCT_CATEGORIES } from "../../schemas/product.schema";
import type { ProductCategory, ProductSortField, SortOrder } from "../../types";
import { getErrorMessage } from "../../utils/apiError.util";
import { formatVndPrice } from "../../utils/format.util";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useProductList } from "../../hooks/useProductList";
import { productService } from "../../services/product.service";
import styles from "./DashboardPage.module.css";

type SortOption = {
  label: string;
  sort: ProductSortField;
  order: SortOrder;
};

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

function getNumericFilter(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function getProductSubtitle(tags: string[]): string {
  if (tags.length > 0) {
    return tags.join(", ");
  }

  return "No tags";
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
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
  const productListOptions = {
    order: selectedSort.order,
    sort: selectedSort.sort,
    ...(category ? { category } : {}),
    ...(searchQuery ? { search: searchQuery } : {}),
    ...(minPriceValue !== undefined ? { minPrice: minPriceValue } : {}),
    ...(maxPriceValue !== undefined ? { maxPrice: maxPriceValue } : {}),
  };
  const {
    status,
    products,
    pagination,
    error,
    retry,
    goToPreviousPage,
    goToNextPage,
  } = useProductList(productListOptions);

  const handleDeleteProduct = async (productId: number, productName: string) => {
    const confirmed = window.confirm(`Delete "${productName}"?`);
    if (!confirmed) {
      return;
    }

    setDeleteError(null);
    setDeletingProductId(productId);

    try {
      await productService.deleteProduct(productId);
      retry();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <section className={styles.dashboardPage}>
      <div className={styles.dashboardInner}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Admin dashboard</p>
            <h1>Products</h1>
          </div>
          <Link to={APP_ROUTES.NEW_PRODUCT} className={styles.createButton}>
            <Plus aria-hidden="true" className={styles.createIcon} />
            <span>Create</span>
          </Link>
        </div>

        <div className={styles.dashboardBody}>
          <aside className={styles.sidePanel} aria-label="Dashboard sections">
            <Link
              to={APP_ROUTES.DASHBOARD}
              className={`${styles.sideNavItem} ${styles.sideNavItemActive}`}
              aria-current="page"
            >
              <Package aria-hidden="true" />
              <span>Products</span>
            </Link>
            <button
              type="button"
              className={styles.sideNavItem}
              aria-disabled="true"
            >
              <Users aria-hidden="true" />
              <span>Users</span>
            </button>
          </aside>

          <div className={styles.dashboardContent}>
            <div className={styles.summary} aria-label="Product summary">
              <div className={styles.summaryItem}>
                <span>Total products</span>
                <strong>{pagination?.total ?? products.length}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Current page</span>
                <strong>
                  {pagination?.page ?? PRODUCT_PAGINATION.INITIAL_PAGE}
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Categories</span>
                <strong>{PRODUCT_CATEGORIES.length}</strong>
              </div>
            </div>

            <div className={styles.filters} aria-label="Product filters">
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ProductCategory | "")
                }
                aria-label="Filter by category"
              >
                <option value="">None</option>
                {PRODUCT_CATEGORIES.map((productCategory) => (
                  <option key={productCategory} value={productCategory}>
                    {productCategory}
                  </option>
                ))}
              </select>

              <label className={styles.filterSearch} htmlFor="dashboard-search">
                <Search aria-hidden="true" className={styles.searchIcon} />
                <input
                  id="dashboard-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                />
              </label>

              <select
                value={sortIndex}
                onChange={(e) => setSortIndex(Number(e.target.value))}
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((option, index) => (
                  <option key={`${option.sort}-${option.order}`} value={index}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min price"
                aria-label="Minimum price"
              />
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price"
                aria-label="Maximum price"
              />
            </div>

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
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Product</th>
                      <th scope="col">Category</th>
                      <th scope="col">Price</th>
                      <th scope="col">Updated</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <Link
                            to={APP_ROUTES.productDetail(product.id)}
                            className={styles.productImageLink}
                            aria-label={`View ${product.name}`}
                          >
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} />
                            ) : (
                              <span>{product.name.slice(0, 1)}</span>
                            )}
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={APP_ROUTES.productDetail(product.id)}
                            className={styles.productName}
                          >
                            {product.name}
                          </Link>
                          <p className={styles.productMeta}>
                            {getProductSubtitle(product.tags)}
                          </p>
                        </td>
                        <td>{product.category}</td>
                        <td>{formatVndPrice(product.price)}</td>
                        <td>
                          {new Date(product.updatedAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <Link
                              to={APP_ROUTES.productEdit(product.id)}
                              className={styles.editButton}
                              aria-label={`Edit ${product.name}`}
                              title="Edit"
                            >
                              <Pencil aria-hidden="true" />
                            </Link>
                            <button
                              type="button"
                              className={styles.deleteButton}
                              onClick={() =>
                                void handleDeleteProduct(
                                  product.id,
                                  product.name,
                                )
                              }
                              disabled={deletingProductId === product.id}
                              aria-label={`Delete ${product.name}`}
                              title="Delete"
                            >
                              <Trash2 aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AsyncState>

            {status === "data" &&
              pagination &&
              pagination.totalPages > PRODUCT_PAGINATION.INITIAL_PAGE && (
                <div className={styles.pagination} aria-label="Dashboard pages">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={!pagination.hasPrevPage}
                  >
                    Prev
                  </button>
                  <span aria-current="page">{pagination.page}</span>
                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
