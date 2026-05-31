import { PRODUCT_DETAIL_COPY } from "../configs/productDetail.config";

export function formatProductCode(productId?: string): string {
  return `${PRODUCT_DETAIL_COPY.CODE_PREFIX}-${productId ?? ""}`;
}
