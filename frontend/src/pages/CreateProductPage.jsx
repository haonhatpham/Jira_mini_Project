import { useNavigate } from "react-router-dom";
import ProductForm from "../components/product/ProductForm/ProductForm.jsx";
import { productService } from "../services/product.service";
import "./CreateProductPage.css";

export default function CreateProductPage() {
  const navigate = useNavigate();

  const handleCreateProduct = async (formData) => {
    await productService.createProduct(formData);
    navigate("/", { replace: true });
  };

  return (
    <section className="create-product-page">
      <h2>Add New Product</h2>
      <p className="create-product-hint">
        Submits via product.service → JSON Server. Start server: npm run server
      </p>
      <ProductForm onSubmit={handleCreateProduct} />
    </section>
  );
}
