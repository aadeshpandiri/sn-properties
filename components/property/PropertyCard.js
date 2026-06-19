import Link from 'next/link';
import Button from '../ui/Button';

export default function PropertyCard({
  id,
  title,
  price,
  bedrooms,
  bathrooms,
  area,
  city,
  status,
  listing_type,
  className = '',
}) {
  const listingLabel = listing_type === 'rent' ? 'For Rent' : 'For Sale';
  const listingStyle = listing_type === 'rent'
    ? 'bg-accent/10 text-accent'
    : 'bg-primary/10 text-primary';

  return (
    <article className={`card overflow-hidden group ${className}`}>
      {/* Image placeholder with gradient */}
      <div className="relative h-52 bg-gradient-to-br from-surface to-border overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        {/* Listing type badge */}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${listingStyle}`}>
          {listingLabel}
        </span>
        {/* Status badge */}
        {status && (
          <span className="absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full bg-white/90 text-muted">
            {status}
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <p className="text-xl font-bold text-accent">{price}</p>
          <h3 className="text-lg font-semibold text-primary mt-1 leading-snug">{title}</h3>
          <p className="text-sm text-muted mt-1">{city}</p>
        </div>

        <div className="flex gap-4 text-sm text-muted border-t border-border pt-4">
          <span className="flex items-center gap-1">
            <span className="text-primary font-medium">{bedrooms}</span> Beds
          </span>
          <span className="flex items-center gap-1">
            <span className="text-primary font-medium">{bathrooms}</span> Baths
          </span>
          <span className="flex items-center gap-1">
            <span className="text-primary font-medium">{area}</span> sqft
          </span>
        </div>

        <Link href={`/properties/${id}`}>
          <Button variant="ghost" className="w-full mt-1">View Details</Button>
        </Link>
      </div>
    </article>
  );
}
