import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../configs/routes.config";
import { selectAddToCart, useCartStore } from "../../../stores/cartStore";
import type { CartProduct } from "../../../types";
import { formatVndPrice } from "../../../utils/format.util";
import { getProductCardMetrics } from "../../../utils/productCard.util";
import "./ProductCard.css";

export default function ProductCard({
  id,
  name,
  price,
  category,
  imageUrl,
}: CartProduct) {
  const addToCart = useCartStore(selectAddToCart);
  const { discount, oldPrice, rating, reviews, stockCount } =
    getProductCardMetrics(id, price);
  const detailPath = APP_ROUTES.productDetail(id);

  return (
    <article className="card">
      <Link to={detailPath} className="card-media-link">
        <span className="card-sale-badge">-{discount}%</span>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="card-image" />
        ) : (
          <div className="card-image card-image-empty">No image</div>
        )}
      </Link>

      <div className="card-body">
        {category && <p className="card-category">{category}</p>}
        <Link to={detailPath} className="card-title-link">
          <h3>{name}</h3>
        </Link>

        <p className="card-rating">
          <Star aria-hidden="true" className="card-icon filled" />
          <strong>{rating}</strong>
          <span>({reviews} reviews)</span>
        </p>

        <p className="card-price">
          {formatVndPrice(price)}
          <small>{formatVndPrice(oldPrice)}</small>
        </p>
      </div>

      <div className="card-actions">
        <span className="card-stock">{stockCount} in stock</span>
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={() => addToCart({ id, name, price, category, imageUrl })}
        >
          <ShoppingCart aria-hidden="true" className="card-icon cart-only" />
          <span>Add to cart</span>
        </button>
      </div>
    </article>
  );
}
