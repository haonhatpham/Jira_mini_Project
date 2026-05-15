import { products } from "../../../data/products";
import ProductCard from "../ProductCard/ProductCard.jsx";
import "./ProductList.css";

export default function ProductList({ onAddToCart }) {
  return (
    <div id="products-container">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
