import ProductCard from "../ProductCard/ProductCard.jsx";
import "./ProductList.css";

export default function ProductList({ products }) {
  return (
    <div id="products-container">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}
