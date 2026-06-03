import AsyncState from "../../components/common/AsyncState/AsyncState";
import Pagination from "../../components/common/Pagination/Pagination";
import ProductList from "../../components/product/ProductList/ProductList";
import { useProductList } from "../../hooks/useProductList";

export default function HomePage() {
  const {
    status,
    products,
    pagination,
    error,
    retry,
    goToPage,
  } = useProductList();

  const handlePageChange = (page: number) => {
    goToPage(page);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

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
      {status === "data" && pagination && (
        <Pagination
          ariaLabel="Product pagination"
          onChange={handlePageChange}
          page={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </section>
  );
}
