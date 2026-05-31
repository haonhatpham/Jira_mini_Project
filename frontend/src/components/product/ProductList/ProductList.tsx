import ProductCard from "../ProductCard/ProductCard";
import type { Product } from "../../../types";
import "./ProductList.css";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div id="products-container">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          category={product.category}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}
