import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../configs/routes.config";

interface ProductDetailAdminActionsProps {
  isDeleting: boolean;
  onDeleteProduct: () => void;
  productId: number;
}

export default function ProductDetailAdminActions({
  isDeleting,
  onDeleteProduct,
  productId,
}: ProductDetailAdminActionsProps) {
  return (
    <div className="admin-actions">
      <Link to={APP_ROUTES.productEdit(productId)} className="admin-edit-link">
        Edit Product
      </Link>
      <button
        type="button"
        className="admin-delete-btn"
        onClick={onDeleteProduct}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Product"}
      </button>
    </div>
  );
}
