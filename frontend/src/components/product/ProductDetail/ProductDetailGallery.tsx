import type { Product } from "../../../types";

interface ProductDetailGalleryProps {
  product: Pick<Product, "imageUrl" | "name">;
}

export default function ProductDetailGallery({
  product,
}: ProductDetailGalleryProps) {
  const { imageUrl, name } = product;

  return (
    <figure className="product-gallery" aria-label={`${name} product image`}>
      <div className="product-media-stage">
        <div className="product-image-frame">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="product-detail-image" />
          ) : (
            <div className="product-detail-image-empty">No image</div>
          )}
        </div>
      </div>
    </figure>
  );
}
