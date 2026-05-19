export function parseTagsInput(value?: string | null): string[] {
  if (!value || !String(value).trim()) return [];
  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
