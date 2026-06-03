import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../configs/routes.config";
import type { DashboardView } from "../dashboard.types";
import styles from "../DashboardPage.module.css";

interface DashboardHeaderProps {
  view: DashboardView;
}

export default function DashboardHeader({ view }: DashboardHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <p className={styles.eyebrow}>Admin dashboard</p>
        <h1>{view === "products" ? "Products" : "Catalog"}</h1>
      </div>
      {view === "products" && (
        <Link to={APP_ROUTES.NEW_PRODUCT} className={styles.createButton}>
          <Plus aria-hidden="true" className={styles.createIcon} />
          <span>Create</span>
        </Link>
      )}
    </div>
  );
}
