import { PRODUCT_DETAIL_COPY } from "../../../configs/productDetail.config";

export default function ProductDetailServices() {
  return (
    <div className="service-row">
      {PRODUCT_DETAIL_COPY.SERVICES.map((message) => (
        <span key={message}>{message}</span>
      ))}
    </div>
  );
}
