export default function StarRating({ rating, max = 5, size = 'text-base' }) {
  return (
    <div className={`flex gap-0.5 ${size}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-accent' : 'text-border'}>
          ★
        </span>
      ))}
    </div>
  );
}
