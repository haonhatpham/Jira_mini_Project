import { UI_COUNTS } from "../../../configs/ui.config";

interface ProductDetailTagsProps {
  tags: string[];
}

export default function ProductDetailTags({ tags }: ProductDetailTagsProps) {
  if (tags.length === UI_COUNTS.EMPTY) {
    return null;
  }

  return (
    <div className="product-detail-tags" aria-label="Product tags">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}
