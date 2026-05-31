import { useParams } from "react-router-dom";
import AsyncState from "../../components/common/AsyncState/AsyncState";
import ProductDeletePending from "../../components/product/ProductDetail/ProductDeletePending";
import ProductDetailView from "../../components/product/ProductDetail/ProductDetailView";
import { PRODUCT_DETAIL_COPY } from "../../configs/productDetail.config";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useProductDetailActions } from "../../hooks/useProductDetailActions";
import { selectIsAdmin, useAuthStore } from "../../stores/authStore";
import { formatProductCode } from "../../utils/productDetail.util";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { status, product, error, retry } = useProductDetail(id);
  const isAdmin = useAuthStore(selectIsAdmin);
  const actions = useProductDetailActions(product);

  return (
    <section className="product-detail">
      <AsyncState
        status={status}
        error={error}
        onRetry={retry}
        loadingMessage={PRODUCT_DETAIL_COPY.LOADING}
        emptyMessage={PRODUCT_DETAIL_COPY.EMPTY}
      >
        {product && actions.isOptimisticallyDeleted && <ProductDeletePending />}

        {product && !actions.isOptimisticallyDeleted && (
          <ProductDetailView
            deleteError={actions.deleteError}
            isAdmin={isAdmin}
            isDeleting={actions.isDeleting}
            onAddToCart={actions.addSelectedQuantity}
            onBuyNow={actions.goToCartAfterAdd}
            onDecreaseQuantity={actions.decreaseQuantity}
            onDeleteProduct={actions.deleteProduct}
            onIncreaseQuantity={actions.increaseQuantity}
            product={product}
            productCode={formatProductCode(id)}
            quantity={actions.quantity}
            showDeleteError={actions.deleteStatus === "error"}
          />
        )}
      </AsyncState>
    </section>
  );
}
