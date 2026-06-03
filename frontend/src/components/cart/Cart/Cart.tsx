import { useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotal,
  selectRemoveFromCart,
  selectUpdateCartQuantity,
  useCartStore,
} from "../../../stores/cartStore";
import { selectShowToast, useToastStore } from "../../../stores/toastStore";
import { CART_QUANTITY } from "../../../configs/cart.config";
import { UI_COUNTS } from "../../../configs/ui.config";
import { formatVndPrice } from "../../../utils/format.util";
import "./Cart.css";

const DELIVERY_COST = 0;
const DELIVERY_TYPE = "Standard Delivery (Free)";

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore(selectCartItems);
  const total = useCartStore(selectCartTotal);
  const removeFromCart = useCartStore(selectRemoveFromCart);
  const updateQuantity = useCartStore(selectUpdateCartQuantity);
  const showToast = useToastStore(selectShowToast);

  if (items.length === UI_COUNTS.EMPTY) {
    return (
      <section id="cart">
        <div className="cart-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
        <h2>Cart</h2>
        <div className="breadcrumb">Home / Cart</div>
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      </section>
    );
  }

  return (
    <section id="cart">
      <div className="cart-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>

      <div className="cart-container">
        <h2>Cart</h2>
        <div className="breadcrumb">Home / Cart</div>

        <div className="cart-layout">
          {/* Left side - Cart items table */}
          <div className="cart-table-section">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="cart-row">
                    <td className="product-details">
                      <div className="product-image">
                        <img
                          src={item.imageUrl || "/placeholder.png"}
                          alt={item.name}
                        />
                      </div>
                      <div className="product-info">
                        <h4>{item.name}</h4>
                        <p className="product-code">Asap Shop</p>
                        <button
                          type="button"
                          className="remove-link"
                          onClick={() => {
                            removeFromCart(item.id);
                            showToast({
                              title: "Removed from cart",
                              description: item.name,
                              variant: "info",
                            });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                    <td className="quantity-cell">
                      <div className="qty-controls">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - CART_QUANTITY.STEP
                            )
                          }
                        >
                          −
                        </button>
                        <input
                          type="text"
                          className="qty-input"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + CART_QUANTITY.STEP
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="price-cell">
                      {formatVndPrice(item.price)}
                    </td>
                    <td className="total-cell">
                      {formatVndPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right side - Totals and checkout */}
          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Total</h3>

              <div className="summary-row">
                <span>Sub. Total</span>
                <span>{formatVndPrice(total)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span>{formatVndPrice(DELIVERY_COST)}</span>
              </div>

              <div className="delivery-option">
                <select className="delivery-select">
                  <option>{DELIVERY_TYPE}</option>
                </select>
              </div>

              <button
                type="button"
                className="checkout-btn"
                onClick={() =>
                  showToast({
                    title: "Checkout is not connected yet",
                    description: "Your cart items are still saved.",
                    variant: "warning",
                  })
                }
              >
                Check Out
              </button>

              <div className="payment-methods">
                <h4>We Accept</h4>
                <div className="payment-icons">
                  <img src="/public/paypal-logo.jpg" alt="PayPal" />
                  <img src="/public/stripe-logo.png" alt="Stripe" />
                  <img src="/public/applepay-logo.png" alt="Apple Pay" />
                  <img src="/public/amazon-logo.png" alt="Amazon" />
                </div>
              </div>

              <p className="discount-text">
                Use a discount code? Add it to the next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
