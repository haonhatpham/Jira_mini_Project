import AsyncState from "../../../components/common/AsyncState/AsyncState";
import type { AsyncStatus, CategoryOption, TagOption } from "../../../types";
import type { EditingMeta, MetaEntity, MetaKind } from "../dashboard.types";
import styles from "../DashboardPage.module.css";
import MetaPanel from "./MetaPanel";

interface CatalogManagementPanelProps {
  actionError: string | null;
  cancelEditMeta: () => void;
  categories: CategoryOption[];
  changeEditingMetaName: (name: string) => void;
  createMeta: (kind: MetaKind) => void;
  deleteMeta: (kind: MetaKind, entity: MetaEntity) => void;
  editingMeta: EditingMeta | null;
  error: string | null;
  newMetaNames: Record<MetaKind, string>;
  pendingKey: string | null;
  refetch: () => void;
  setNewMetaName: (kind: MetaKind, name: string) => void;
  startEditMeta: (kind: MetaKind, entity: MetaEntity) => void;
  status: AsyncStatus;
  tags: TagOption[];
  updateMeta: () => void;
}

export default function CatalogManagementPanel({
  actionError,
  cancelEditMeta,
  categories,
  changeEditingMetaName,
  createMeta,
  deleteMeta,
  editingMeta,
  error,
  newMetaNames,
  pendingKey,
  refetch,
  setNewMetaName,
  startEditMeta,
  status,
  tags,
  updateMeta,
}: CatalogManagementPanelProps) {
  return (
    <AsyncState
      status={status}
      error={error}
      onRetry={refetch}
      emptyMessage="No catalog data found."
      loadingMessage="Loading catalog..."
    >
      {actionError && (
        <p className={styles.errorMessage} role="alert">
          {actionError}
        </p>
      )}

      <div className={styles.metaGrid}>
        <MetaPanel
          editingMeta={editingMeta}
          entities={categories}
          kind="category"
          newMetaName={newMetaNames.category}
          onCancelEdit={cancelEditMeta}
          onChangeEditingName={changeEditingMetaName}
          onChangeNewName={setNewMetaName}
          onCreate={createMeta}
          onDelete={deleteMeta}
          onStartEdit={startEditMeta}
          onUpdate={updateMeta}
          pendingKey={pendingKey}
        />
        <MetaPanel
          editingMeta={editingMeta}
          entities={tags}
          kind="tag"
          newMetaName={newMetaNames.tag}
          onCancelEdit={cancelEditMeta}
          onChangeEditingName={changeEditingMetaName}
          onChangeNewName={setNewMetaName}
          onCreate={createMeta}
          onDelete={deleteMeta}
          onStartEdit={startEditMeta}
          onUpdate={updateMeta}
          pendingKey={pendingKey}
        />
      </div>
    </AsyncState>
  );
}
