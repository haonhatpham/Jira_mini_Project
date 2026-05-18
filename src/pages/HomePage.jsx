import AsyncState from "../components/common/AsyncState/AsyncState.jsx";
import ProductList from "../components/product/ProductList/ProductList.jsx";
import { useProductList } from "../hooks/useProductList";

export default function HomePage() {
  const { status, products, error, retry } = useProductList();

  return (
    <section id="products">
      <h2>Our Products</h2>
      <AsyncState
        status={status}
        error={error}
        onRetry={retry}
        emptyMessage="No products yet. Add one from Add Product."
        loadingMessage="Loading products…"
      >
        <ProductList products={products} />
      </AsyncState>
    </section>
  );
}
