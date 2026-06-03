import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../configs/routes.config";
import { selectAddToCart, useCartStore } from "../../../stores/cartStore";
import { selectShowToast, useToastStore } from "../../../stores/toastStore";
import type { CartProduct } from "../../../types";
import { formatVndPrice } from "../../../utils/format.util";
import { getProductCardMetrics } from "../../../utils/productCard.util";
import "./ProductCard.css";

interface ProductCardProps {
  product: CartProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore(selectAddToCart);
  const showToast = useToastStore(selectShowToast);
  const { id, name, price, category, imageUrl } = product;
  const { discount, oldPrice, rating, reviews, stockCount } =
    getProductCardMetrics(id, price);
  const detailPath = APP_ROUTES.productDetail(id);
  const handleAddToCart = () => {
    addToCart(product);
    showToast({
      title: "Added to cart",
      description: name,
      variant: "success",
    });
  };

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
          onClick={handleAddToCart}
        >
          <ShoppingCart aria-hidden="true" className="card-icon cart-only" />
          <span>Add to cart</span>
        </button>
      </div>
    </article>
  );
}
