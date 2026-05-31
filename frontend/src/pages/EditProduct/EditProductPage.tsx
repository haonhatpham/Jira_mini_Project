import { useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createIdempotencyKey } from "../../api/idempotency";
import AsyncState from "../../components/common/AsyncState/AsyncState";
import ProductForm from "../../components/product/ProductForm/ProductForm";
import { APP_ROUTES } from "../../configs/routes.config";
import { useProductDetail } from "../../hooks/useProductDetail";
import { productService } from "../../services/product.service";
import type { Product, ProductFormValues } from "../../types";
import "./EditProductPage.css";

function mapProductToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name || "",
    desc: product.description || "",
    price: String(product.price ?? ""),
    category: product.category || "",
    tags: product.tags || [],
    imageUrl: product.imageUrl || "",
  };
}

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, product, error, retry } = useProductDetail(id);
  const idempotencyKeyRef = useRef(createIdempotencyKey());

  const initialValues = useMemo(
    () => (product ? mapProductToFormValues(product) : undefined),
    [product],
  );

  const handleUpdateProduct = async (formData: ProductFormValues) => {
    if (!id) {
      throw new Error("Product id is required.");
    }

    const updatedProduct = await productService.updateProduct(id, formData, {
      idempotencyKey: idempotencyKeyRef.current,
    });
    idempotencyKeyRef.current = createIdempotencyKey();
    navigate(APP_ROUTES.productDetail(updatedProduct.id), { replace: true });
  };

  return (
    <section className="create-product-page">
      <Link to={APP_ROUTES.productDetail(id ?? "")} className="back-link">
        Back to product
      </Link>
      <h2>Edit Product</h2>
      <p className="create-product-hint">
        Updates this product through the backend API and saves it to the
        database.
      </p>

      <AsyncState
        status={status}
        error={error}
        onRetry={retry}
        loadingMessage="Loading product..."
        emptyMessage="Product not found."
      >
        {product && initialValues && (
          <ProductForm
            initialValues={initialValues}
            onSubmit={handleUpdateProduct}
            resetOnSuccess={false}
            submitLabel="Update Product"
            successMessageText="Product updated successfully!"
          />
        )}
      </AsyncState>
    </section>
  );
}
