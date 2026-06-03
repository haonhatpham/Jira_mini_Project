import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createIdempotencyKey } from "../../api/idempotency";
import ProductForm from "../../components/product/ProductForm/ProductForm";
import { APP_ROUTES } from "../../configs/routes.config";
import { productService } from "../../services/product.service";
import { selectShowToast, useToastStore } from "../../stores/toastStore";
import type { ProductFormValues } from "../../types";
import "./CreateProductPage.css";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const idempotencyKeyRef = useRef(createIdempotencyKey());
  const showToast = useToastStore(selectShowToast);

  const handleCreateProduct = async (formData: ProductFormValues) => {
    await productService.createProduct(formData, {
      idempotencyKey: idempotencyKeyRef.current,
    });
    showToast({
      title: "Product created",
      description: formData.name,
      variant: "success",
    });
    idempotencyKeyRef.current = createIdempotencyKey();
    navigate(APP_ROUTES.HOME, { replace: true });
  };

  return (
    <section className="create-product-page">
      <h2>Add New Product</h2>
      <ProductForm
        onSubmit={handleCreateProduct}
        submitLabel="Create Product"
        successMessageText="Product created successfully!"
      />
    </section>
  );
}
