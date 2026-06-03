import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../configs/routes.config";
import type { Product } from "../../../types";
import { formatVndPrice } from "../../../utils/format.util";
import { getProductSubtitle } from "../dashboard.utils";
import styles from "../DashboardPage.module.css";

interface ProductTableProps {
  deletingProductId: number | null;
  onDeleteProduct: (product: Product) => void;
  products: Product[];
}

export default function ProductTable({
  deletingProductId,
  onDeleteProduct,
  products,
}: ProductTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Product</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Updated</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Link
                  to={APP_ROUTES.productDetail(product.id)}
                  className={styles.productImageLink}
                  aria-label={`View ${product.name}`}
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <span>{product.name.slice(0, 1)}</span>
                  )}
                </Link>
              </td>
              <td>
                <Link
                  to={APP_ROUTES.productDetail(product.id)}
                  className={styles.productName}
                >
                  {product.name}
                </Link>
                <p className={styles.productMeta}>
                  {getProductSubtitle(product.tags)}
                </p>
              </td>
              <td>{product.category}</td>
              <td>{formatVndPrice(product.price)}</td>
              <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
              <td>
                <div className={styles.rowActions}>
                  <Link
                    to={APP_ROUTES.productEdit(product.id)}
                    className={styles.editButton}
                    aria-label={`Edit ${product.name}`}
                    title="Edit"
                  >
                    <Pencil aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => onDeleteProduct(product)}
                    disabled={deletingProductId === product.id}
                    aria-label={`Delete ${product.name}`}
                    title="Delete"
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
