import { PRODUCT_PAGINATION } from "../../../configs/pagination.config";
import type { ProductPagination } from "../../../types";
import styles from "../DashboardPage.module.css";

interface ProductSummaryProps {
  categoryCount: number;
  productCount: number;
  pagination: ProductPagination | null;
}

export default function ProductSummary({
  categoryCount,
  pagination,
  productCount,
}: ProductSummaryProps) {
  return (
    <div className={styles.summary} aria-label="Product summary">
      <div className={styles.summaryItem}>
        <span>Total products</span>
        <strong>{pagination?.total ?? productCount}</strong>
      </div>
      <div className={styles.summaryItem}>
        <span>Current page</span>
        <strong>{pagination?.page ?? PRODUCT_PAGINATION.INITIAL_PAGE}</strong>
      </div>
      <div className={styles.summaryItem}>
        <span>Categories</span>
        <strong>{categoryCount}</strong>
      </div>
    </div>
  );
}
