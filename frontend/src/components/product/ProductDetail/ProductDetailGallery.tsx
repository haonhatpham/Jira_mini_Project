interface ProductDetailGalleryProps {
  imageUrl: string;
  name: string;
}

export default function ProductDetailGallery({
  imageUrl,
  name,
}: ProductDetailGalleryProps) {
  return (
    <div className="product-gallery">
      <div className="product-image-frame">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="product-detail-image" />
        ) : (
          <div className="product-detail-image product-detail-image-empty">
            No image
          </div>
        )}
      </div>
    </div>
  );
}
