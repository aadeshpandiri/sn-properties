import Button from '../ui/Button';

export default function PropertyCard({ title, price, bedrooms, bathrooms, area, city, status, className = '' }) {
  return (
    <article className={`card p-6 ${className}`}>
      <div className="mb-4 h-48 rounded-xl bg-surface" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{status}</p>
            <h3 className="text-2xl font-semibold text-primary">{title}</h3>
          </div>
          <p className="text-lg font-semibold text-secondary">{price}</p>
        </div>
        <p className="text-sm text-muted">{city}</p>
        <div className="flex flex-wrap gap-4 text-sm text-primary">
          <span>{bedrooms} Beds</span>
          <span>{bathrooms} Baths</span>
          <span>{area} sqft</span>
        </div>
        <Button variant="ghost" className="w-full mt-2">View Details</Button>
      </div>
    </article>
  );
}
