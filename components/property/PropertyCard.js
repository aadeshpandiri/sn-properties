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
  imageUrl,
  className = '',
}) {
  const listingLabel = listing_type === 'rent' ? 'For Rent' : 'For Sale';
  const listingStyle = listing_type === 'rent'
    ? 'bg-accent text-primary'
    : 'bg-primary text-white';

  return (
    <article className={`card overflow-hidden group flex flex-col ${className}`}>
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-surface to-border overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        )}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${listingStyle}`}>
          {listingLabel}
        </span>
        {status && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white capitalize">
            {status}
          </span>
        )}
      </div>

      {/* Content — flex-col so button always sits at the bottom */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex-1">
          <p className="text-xl font-bold text-accent">{price}</p>
          <h3 className="text-lg font-semibold text-primary mt-1 leading-snug min-h-[3.5rem]">{title}</h3>
          <p className="text-sm text-muted mt-1">{city}</p>
        </div>

        <div className="flex gap-4 text-sm text-muted border-t border-border pt-4">
          {bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-primary font-medium">{bedrooms}</span> Beds
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="text-primary font-medium">{bathrooms}</span> Baths
          </span>
          <span className="flex items-center gap-1">
            <span className="text-primary font-medium">{area?.toLocaleString()}</span> sqft
          </span>
        </div>

        <Link href={`/properties/${id}`}>
          <Button variant="ghost" className="w-full">View Details</Button>
        </Link>
      </div>
    </article>
  );
}
