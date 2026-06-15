export default function ImageGallery({ images = [], className = '' }) {
  if (!images.length) {
    return <div className={`rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted ${className}`}>No images available</div>;
  }

  return (
    <div className={`grid gap-4 md:grid-cols-3 ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="overflow-hidden rounded-xl bg-surface">
          <img src={image} alt={`Gallery image ${index + 1}`} className="h-48 w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
