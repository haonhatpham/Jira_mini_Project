import { PRODUCT_DETAIL_COPY } from "../../../configs/productDetail.config";

export default function ProductDeletePending() {
  return (
    <div className="delete-pending-state" role="status">
      <strong>{PRODUCT_DETAIL_COPY.DELETE_PENDING_TITLE}</strong>
      <p>{PRODUCT_DETAIL_COPY.DELETE_PENDING}</p>
    </div>
  );
}
