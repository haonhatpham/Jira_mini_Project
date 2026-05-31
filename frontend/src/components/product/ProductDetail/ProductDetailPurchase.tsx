import { ShoppingCart } from "lucide-react";

interface ProductDetailPurchaseProps {
  isDeleting: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  quantity: number;
}

export default function ProductDetailPurchase({
  isDeleting,
  onAddToCart,
  onBuyNow,
  onDecreaseQuantity,
  onIncreaseQuantity,
  quantity,
}: ProductDetailPurchaseProps) {
  return (
    <>
      <div className="purchase-row">
        <div className="quantity-stepper" aria-label="Quantity">
          <button type="button" onClick={onDecreaseQuantity}>
            -
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={onIncreaseQuantity}>
            +
          </button>
        </div>

        <button
          type="button"
          className="detail-outline-btn"
          onClick={onAddToCart}
          disabled={isDeleting}
        >
          <ShoppingCart aria-hidden="true" className="detail-icon" />
          THEM VAO GIO
        </button>
      </div>

      <button
        type="button"
        className="detail-buy-btn"
        onClick={onBuyNow}
        disabled={isDeleting}
      >
        MUA NGAY
      </button>
    </>
  );
}
