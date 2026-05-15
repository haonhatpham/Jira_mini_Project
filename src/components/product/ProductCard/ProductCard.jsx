import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ id, name, price, onAddToCart }) {
  return (
    <div className="card">
      <Link to={`/products/${id}`} className="card-title-link">
        <h3>{name}</h3>
      </Link>
      <p className="card-price">{price}$</p>
      <div className="card-actions">
        <Link to={`/products/${id}`} className="view-detail-link">
          View details
        </Link>
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={() => onAddToCart({ id, name, price })}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
