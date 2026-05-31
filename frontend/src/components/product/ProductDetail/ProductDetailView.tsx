import { Link } from "react-router-dom";
import { PRODUCT_DETAIL_COPY } from "../../../configs/productDetail.config";
import { APP_ROUTES } from "../../../configs/routes.config";
import type { Product } from "../../../types";
import { formatVndPrice } from "../../../utils/format.util";
import ProductDetailAdminActions from "./ProductDetailAdminActions";
import ProductDetailGallery from "./ProductDetailGallery";
import ProductDetailPurchase from "./ProductDetailPurchase";
import ProductDetailServices from "./ProductDetailServices";
import ProductDetailTags from "./ProductDetailTags";

interface ProductDetailViewProps {
  deleteError: string | null;
  isAdmin: boolean;
  isDeleting: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onDecreaseQuantity: () => void;
  onDeleteProduct: () => void;
  onIncreaseQuantity: () => void;
  product: Product;
  productCode: string;
  quantity: number;
  showDeleteError: boolean;
}

export default function ProductDetailView({
  deleteError,
  isAdmin,
  isDeleting,
  onAddToCart,
  onBuyNow,
  onDecreaseQuantity,
  onDeleteProduct,
  onIncreaseQuantity,
  product,
  productCode,
  quantity,
  showDeleteError,
}: ProductDetailViewProps) {
  return (
    <div className="product-detail-shell">
      <Link to={APP_ROUTES.HOME} className="back-link">
        Back to products
      </Link>

      <div className="product-detail-layout">
        <ProductDetailGallery imageUrl={product.imageUrl} name={product.name} />

        <div className="product-info-panel">
          <p className="product-detail-id">Ma san pham: {productCode}</p>
          <h2>{product.name}</h2>
          <p className="product-detail-price">
            {formatVndPrice(product.price)}
          </p>

          {isAdmin && (
            <ProductDetailAdminActions
              isDeleting={isDeleting}
              onDeleteProduct={onDeleteProduct}
              productId={product.id}
            />
          )}

          {showDeleteError && (
            <p className="delete-error" role="alert">
              {deleteError || PRODUCT_DETAIL_COPY.DELETE_FAILED}
            </p>
          )}

          <p className="product-detail-desc">{product.description}</p>
          <ProductDetailTags tags={product.tags} />
          <ProductDetailPurchase
            isDeleting={isDeleting}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
            onDecreaseQuantity={onDecreaseQuantity}
            onIncreaseQuantity={onIncreaseQuantity}
            quantity={quantity}
          />
          <ProductDetailServices />
        </div>
      </div>
    </div>
  );
}
