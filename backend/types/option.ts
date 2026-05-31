/**
 * Shared id/name response types for category and tag options.
 */
export type NamedEntity = {
  id: number;
  name: string;
};

export type CategoryOption = NamedEntity;
export type TagOption = NamedEntity;
