import { Link, useNavigate, useParams } from "react-router-dom";
import AsyncState from "../components/common/AsyncState/AsyncState.jsx";
import { useProductDetail } from "../hooks/useProductDetail";
import { selectAddToCart, useCartStore } from "../stores/cartStore";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, product, error, retry } = useProductDetail(id);
  const addToCart = useCartStore(selectAddToCart);

  const handleAddAndGoToCart = () => {
    if (!product) return;
    addToCart(product);
    navigate("/cart");
  };

  return (
    <section className="product-detail">
      <AsyncState
        status={status}
        error={error}
        onRetry={retry}
        loadingMessage="Loading product…"
        emptyMessage="Product not found."
      >
        {product && (
          <>
            <p className="product-detail-id">Product ID from URL: {id}</p>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-detail-image"
              />
            )}
            <h2>{product.name}</h2>
            {product.category && (
              <p className="product-detail-meta">Category: {product.category}</p>
            )}
            <p className="product-detail-price">${product.price}</p>
            <p className="product-detail-desc">{product.description}</p>
            {product.tags?.length > 0 && (
              <p className="product-detail-tags">
                Tags: {product.tags.join(", ")}
              </p>
            )}
            <div className="product-detail-actions">
              <button
                type="button"
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleAddAndGoToCart}
              >
                Add &amp; Go to Cart
              </button>
              <Link to="/" className="back-link">
                ← Back to products
              </Link>
            </div>
          </>
        )}
      </AsyncState>
    </section>
  );
}
