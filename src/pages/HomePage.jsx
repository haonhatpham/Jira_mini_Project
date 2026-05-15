import ProductList from "../components/product/ProductList/ProductList.jsx";

export default function HomePage({ onAddToCart }) {
  return (
    <section id="products">
      <h2>Our Products</h2>
      <ProductList onAddToCart={onAddToCart} />
    </section>
  );
}
