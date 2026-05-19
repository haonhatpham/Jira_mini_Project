import { Link } from "react-router-dom";
import { selectAddToCart, useCartStore } from "../../../stores/cartStore";
import "./ProductCard.css";

export default function ProductCard({ id, name, price, imageUrl }) {
  const addToCart = useCartStore(selectAddToCart);

  return (
    <div className="card">
      {imageUrl && (
        <img src={imageUrl} alt={name} className="card-image" />
      )}
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
          onClick={() => addToCart({ id, name, price, imageUrl })}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
