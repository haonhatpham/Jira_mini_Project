import { useState } from "react";
import CatalogManagementPanel from "./components/CatalogManagementPanel";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";
import ProductManagementPanel from "./components/ProductManagementPanel";
import type { DashboardView } from "./dashboard.types";
import styles from "./DashboardPage.module.css";
import { useDashboardCatalog } from "./hooks/useDashboardCatalog";
import { useDashboardProducts } from "./hooks/useDashboardProducts";

export default function DashboardPage() {
  const [dashboardView, setDashboardView] =
    useState<DashboardView>("products");
  const products = useDashboardProducts();
  const catalog = useDashboardCatalog({
    onAfterRefresh: products.retry,
    onBeforeRefresh: products.clearCategory,
  });

  return (
    <section className={styles.dashboardPage}>
      <div className={styles.dashboardInner}>
        <DashboardHeader view={dashboardView} />

        <div className={styles.dashboardBody}>
          <DashboardSidebar
            onViewChange={setDashboardView}
            view={dashboardView}
          />

          <div className={styles.dashboardContent}>
            {dashboardView === "products" ? (
              <ProductManagementPanel
                categories={catalog.categories}
                deleteError={products.deleteError}
                deletingProductId={products.deletingProductId}
                error={products.error}
                filters={products.filters}
                goToPage={products.goToPage}
                onDeleteProduct={products.deleteProduct}
                pagination={products.pagination}
                products={products.products}
                retry={products.retry}
                sortOptions={products.sortOptions}
                status={products.status}
              />
            ) : (
              <CatalogManagementPanel
                actionError={catalog.actionError}
                cancelEditMeta={catalog.cancelEditMeta}
                categories={catalog.categories}
                changeEditingMetaName={catalog.changeEditingMetaName}
                createMeta={catalog.createMeta}
                deleteMeta={catalog.deleteMeta}
                editingMeta={catalog.editingMeta}
                error={catalog.error}
                newMetaNames={catalog.newMetaNames}
                pendingKey={catalog.pendingKey}
                refetch={catalog.refetch}
                setNewMetaName={catalog.setNewMetaName}
                startEditMeta={catalog.startEditMeta}
                status={catalog.status}
                tags={catalog.tags}
                updateMeta={catalog.updateMeta}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
