import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import type { EditingMeta, MetaEntity, MetaKind } from "../dashboard.types";
import { getMetaLabel } from "../dashboard.utils";
import styles from "../DashboardPage.module.css";

interface MetaPanelProps {
  editingMeta: EditingMeta | null;
  entities: MetaEntity[];
  kind: MetaKind;
  newMetaName: string;
  onCancelEdit: () => void;
  onChangeEditingName: (name: string) => void;
  onChangeNewName: (kind: MetaKind, name: string) => void;
  onCreate: (kind: MetaKind) => void;
  onDelete: (kind: MetaKind, entity: MetaEntity) => void;
  onStartEdit: (kind: MetaKind, entity: MetaEntity) => void;
  onUpdate: () => void;
  pendingKey: string | null;
}

export default function MetaPanel({
  editingMeta,
  entities,
  kind,
  newMetaName,
  onCancelEdit,
  onChangeEditingName,
  onChangeNewName,
  onCreate,
  onDelete,
  onStartEdit,
  onUpdate,
  pendingKey,
}: MetaPanelProps) {
  const label = getMetaLabel(kind);
  const pendingCreate = pendingKey === `${kind}:create`;

  return (
    <section className={styles.metaPanel}>
      <div className={styles.metaPanelHeader}>
        <div>
          <h2>{label}s</h2>
          <p>{entities.length} item(s)</p>
        </div>
      </div>

      <form
        className={styles.metaForm}
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(kind);
        }}
      >
        <input
          value={newMetaName}
          onChange={(event) => onChangeNewName(kind, event.target.value)}
          placeholder={`New ${label.toLowerCase()}`}
          aria-label={`New ${label.toLowerCase()}`}
        />
        <button type="submit" disabled={pendingCreate}>
          <Plus aria-hidden="true" />
          <span>Add</span>
        </button>
      </form>

      <div className={styles.metaList}>
        {entities.map((entity) => {
          const isEditing =
            editingMeta?.kind === kind && editingMeta.id === entity.id;
          const pendingRow =
            pendingKey === `${kind}:update:${entity.id}` ||
            pendingKey === `${kind}:delete:${entity.id}`;

          return (
            <div className={styles.metaRow} key={entity.id}>
              {isEditing ? (
                <input
                  value={editingMeta.name}
                  onChange={(event) => onChangeEditingName(event.target.value)}
                  aria-label={`Edit ${label.toLowerCase()}`}
                />
              ) : (
                <span>{entity.name}</span>
              )}

              <div className={styles.metaActions}>
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={onUpdate}
                      disabled={pendingRow}
                      aria-label={`Save ${entity.name}`}
                      title="Save"
                    >
                      <Check aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={onCancelEdit}
                      disabled={pendingRow}
                      aria-label="Cancel edit"
                      title="Cancel"
                    >
                      <X aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onStartEdit(kind, entity)}
                      disabled={pendingKey !== null}
                      aria-label={`Edit ${entity.name}`}
                      title="Edit"
                    >
                      <Pencil aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(kind, entity)}
                      disabled={pendingKey !== null}
                      aria-label={`Delete ${entity.name}`}
                      title="Delete"
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
