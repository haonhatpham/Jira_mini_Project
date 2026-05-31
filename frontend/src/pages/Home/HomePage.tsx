import AsyncState from "../../components/common/AsyncState/AsyncState";
import ProductList from "../../components/product/ProductList/ProductList";
import { PRODUCT_PAGINATION } from "../../configs/pagination.config";
import { useProductList } from "../../hooks/useProductList";

export default function HomePage() {
  const {
    status,
    products,
    pagination,
    error,
    retry,
    goToPreviousPage,
    goToNextPage,
  } = useProductList();

  return (
    <section id="products">
      <AsyncState
        status={status}
        error={error}
        onRetry={retry}
        emptyMessage="No products yet. Add one from Add Product."
        loadingMessage="Loading products..."
      >
        <ProductList products={products} />
      </AsyncState>
      {status === "data" &&
        pagination &&
        pagination.totalPages > PRODUCT_PAGINATION.INITIAL_PAGE && (
          <div className="pagination-controls" aria-label="Product pagination">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={!pagination.hasPrevPage}
              aria-label="Previous page"
            >
              Prev
            </button>
            <button type="button" className="active-page" aria-current="page">
              {pagination.page}
            </button>
            {pagination.totalPages > pagination.page && (
              <button
                type="button"
                onClick={goToNextPage}
                aria-label={`Go to page ${pagination.page + PRODUCT_PAGINATION.PAGE_STEP}`}
              >
                {pagination.page + PRODUCT_PAGINATION.PAGE_STEP}
              </button>
            )}
            <button
              type="button"
              onClick={goToNextPage}
              disabled={!pagination.hasNextPage}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
    </section>
  );
}
