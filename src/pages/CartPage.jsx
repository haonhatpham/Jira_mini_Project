import Cart from "../components/cart/Cart/Cart.jsx";

export default function CartPage({ items, onRemove, onUpdateQuantity }) {
  return (
    <Cart
      items={items}
      onRemove={onRemove}
      onUpdateQuantity={onUpdateQuantity}
    />
  );
}
