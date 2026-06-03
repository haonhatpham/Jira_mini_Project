import type { MetaKind } from "./dashboard.types";

export function getMetaLabel(kind: MetaKind): string {
  return kind === "category" ? "Category" : "Tag";
}

export function getProductSubtitle(tags: string[]): string {
  if (tags.length > 0) {
    return tags.join(", ");
  }

  return "No tags";
}
