import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../data/products";
import "./ProductDetailPage.css";

export default function ProductDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);

  if (!product) {
    return (
      <section className="product-detail">
        <h2>Product not found</h2>
        <Link to="/">Back to Home</Link>
      </section>
    );
  }

  const handleAddAndGoToCart = () => {
    onAddToCart(product);
    navigate("/cart");
  };

  return (
    <section className="product-detail">
      <p className="product-detail-id">Product ID from URL: {id}</p>
      <h2>{product.name}</h2>
      <p className="product-detail-price">${product.price}</p>
      <p className="product-detail-desc">{product.description}</p>
      <div className="product-detail-actions">
        <button type="button" className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
          Add to Cart
        </button>
        <button type="button" className="secondary-btn" onClick={handleAddAndGoToCart}>
          Add &amp; Go to Cart
        </button>
        <Link to="/" className="back-link">
          ← Back to products
        </Link>
      </div>
    </section>
  );
}
