import { Package, Tags, Users } from "lucide-react";
import type { DashboardView } from "../dashboard.types";
import styles from "../DashboardPage.module.css";

interface DashboardSidebarProps {
  onViewChange: (view: DashboardView) => void;
  view: DashboardView;
}

export default function DashboardSidebar({
  onViewChange,
  view,
}: DashboardSidebarProps) {
  return (
    <aside className={styles.sidePanel} aria-label="Dashboard sections">
      <button
        type="button"
        className={`${styles.sideNavItem} ${
          view === "products" ? styles.sideNavItemActive : ""
        }`}
        onClick={() => onViewChange("products")}
        aria-current={view === "products" ? "page" : undefined}
      >
        <Package aria-hidden="true" />
        <span>Products</span>
      </button>
      <button
        type="button"
        className={`${styles.sideNavItem} ${
          view === "metadata" ? styles.sideNavItemActive : ""
        }`}
        onClick={() => onViewChange("metadata")}
        aria-current={view === "metadata" ? "page" : undefined}
      >
        <Tags aria-hidden="true" />
        <span>Catalog</span>
      </button>
      <button type="button" className={styles.sideNavItem} aria-disabled="true">
        <Users aria-hidden="true" />
        <span>Users</span>
      </button>
    </aside>
  );
}
