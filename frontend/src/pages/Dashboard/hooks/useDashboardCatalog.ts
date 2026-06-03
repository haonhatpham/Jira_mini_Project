import { useState } from "react";
import { useProductOptions } from "../../../hooks/useProductOptions";
import { productMetaService } from "../../../services/productMeta.service";
import { selectShowToast, useToastStore } from "../../../stores/toastStore";
import { getErrorMessage } from "../../../utils/apiError.util";
import type { EditingMeta, MetaEntity, MetaKind } from "../dashboard.types";
import { getMetaLabel } from "../dashboard.utils";

interface UseDashboardCatalogOptions {
  onAfterRefresh?: () => Promise<void> | void;
  onBeforeRefresh?: () => Promise<void> | void;
}

export function useDashboardCatalog({
  onAfterRefresh,
  onBeforeRefresh,
}: UseDashboardCatalogOptions = {}) {
  const showToast = useToastStore(selectShowToast);
  const {
    categories,
    error,
    refetch,
    status,
    tags,
  } = useProductOptions();
  const [newMetaNames, setNewMetaNames] = useState<Record<MetaKind, string>>({
    category: "",
    tag: "",
  });
  const [editingMeta, setEditingMeta] = useState<EditingMeta | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const refreshAfterChange = async (): Promise<void> => {
    await onBeforeRefresh?.();
    await refetch();
    await onAfterRefresh?.();
  };

  const setNewMetaName = (kind: MetaKind, name: string): void => {
    setNewMetaNames((current) => ({
      ...current,
      [kind]: name,
    }));
  };

  const startEditMeta = (kind: MetaKind, entity: MetaEntity): void => {
    setEditingMeta({
      id: entity.id,
      kind,
      name: entity.name,
    });
  };

  const changeEditingMetaName = (name: string): void => {
    setEditingMeta((current) => (current ? { ...current, name } : current));
  };

  const cancelEditMeta = (): void => {
    setEditingMeta(null);
  };

  const createMeta = async (kind: MetaKind): Promise<void> => {
    const name = newMetaNames[kind].trim();
    if (!name) {
      setActionError(`${getMetaLabel(kind)} name is required.`);
      return;
    }

    setActionError(null);
    setPendingKey(`${kind}:create`);

    try {
      if (kind === "category") {
        await productMetaService.createCategory({ name });
      } else {
        await productMetaService.createTag({ name });
      }

      setNewMetaName(kind, "");
      showToast({
        title: `${getMetaLabel(kind)} created`,
        description: name,
        variant: "success",
      });
      await refreshAfterChange();
    } catch (err) {
      const message = getErrorMessage(err);
      setActionError(message);
      showToast({
        title: `${getMetaLabel(kind)} create failed`,
        description: message,
        variant: "error",
      });
    } finally {
      setPendingKey(null);
    }
  };

  const updateMeta = async (): Promise<void> => {
    if (!editingMeta) {
      return;
    }

    const name = editingMeta.name.trim();
    if (!name) {
      setActionError(`${getMetaLabel(editingMeta.kind)} name is required.`);
      return;
    }

    setActionError(null);
    setPendingKey(`${editingMeta.kind}:update:${editingMeta.id}`);

    try {
      if (editingMeta.kind === "category") {
        await productMetaService.updateCategory(editingMeta.id, { name });
      } else {
        await productMetaService.updateTag(editingMeta.id, { name });
      }

      showToast({
        title: `${getMetaLabel(editingMeta.kind)} updated`,
        description: name,
        variant: "success",
      });
      setEditingMeta(null);
      await refreshAfterChange();
    } catch (err) {
      const message = getErrorMessage(err);
      setActionError(message);
      showToast({
        title: `${getMetaLabel(editingMeta.kind)} update failed`,
        description: message,
        variant: "error",
      });
    } finally {
      setPendingKey(null);
    }
  };

  const deleteMeta = async (
    kind: MetaKind,
    entity: MetaEntity,
  ): Promise<void> => {
    const confirmed = window.confirm(`Delete "${entity.name}"?`);
    if (!confirmed) {
      return;
    }

    setActionError(null);
    setPendingKey(`${kind}:delete:${entity.id}`);

    try {
      if (kind === "category") {
        await productMetaService.deleteCategory(entity.id);
      } else {
        await productMetaService.deleteTag(entity.id);
      }

      showToast({
        title: `${getMetaLabel(kind)} deleted`,
        description: entity.name,
        variant: "success",
      });
      if (editingMeta?.id === entity.id && editingMeta.kind === kind) {
        setEditingMeta(null);
      }
      await refreshAfterChange();
    } catch (err) {
      const message = getErrorMessage(err);
      setActionError(message);
      showToast({
        title: `${getMetaLabel(kind)} delete failed`,
        description: message,
        variant: "error",
      });
    } finally {
      setPendingKey(null);
    }
  };

  return {
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
  };
}
