import {
  selectCartItems,
  selectCartTotal,
  selectRemoveFromCart,
  selectUpdateCartQuantity,
  useCartStore,
} from "../../../stores/cartStore";
import "./Cart.css";

export default function Cart() {
  const items = useCartStore(selectCartItems);
  const total = useCartStore(selectCartTotal);
  const removeFromCart = useCartStore(selectRemoveFromCart);
  const updateQuantity = useCartStore(selectUpdateCartQuantity);

  if (items.length === 0) {
    return (
      <section id="cart">
        <h2>Shopping Cart</h2>
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      </section>
    );
  }

  return (
    <section id="cart">
      <h2>Shopping Cart ({items.length} items)</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-price">${item.price}</p>
            </div>

            <div className="item-controls">
              <button
                type="button"
                className="qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <span className="qty-display">{item.quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="item-total">
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <button
              type="button"
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
    </section>
  );
}
