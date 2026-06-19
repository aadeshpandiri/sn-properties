import Link from 'next/link';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import Pagination from '@/components/property/Pagination';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { PAGINATION_LIMIT } from '@/lib/constants';

export const metadata = {
  title: 'Browse Properties — SN Properties',
  description: 'Search and filter premium real estate listings — apartments, houses, villas and more.',
};

const LIMIT = PAGINATION_LIMIT;

async function fetchProperties({ listing_type, property_type, city, sort, min_price, max_price, page }) {
  if (!supabase) return { properties: [], total: 0 };

  const offset = (page - 1) * LIMIT;

  let query = supabase
    .from('properties')
    .select('id, title, slug, price, bedrooms, bathrooms, area, city, status, listing_type, property_type', { count: 'exact' })
    .eq('status', 'available');

  if (listing_type) query = query.eq('listing_type', listing_type);
  if (property_type) query = query.eq('property_type', property_type);
  if (city) query = query.ilike('city', `%${city}%`);
  if (min_price) query = query.gte('price', parseFloat(min_price));
  if (max_price) query = query.lte('price', parseFloat(max_price));

  if (sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: properties, count, error } = await query.range(offset, offset + LIMIT - 1);

  if (error || !properties) return { properties: [], total: 0 };

  // Fetch first image for each property (separate query for reliability)
  let result = properties;
  if (properties.length > 0) {
    const ids = properties.map((p) => p.id);
    const { data: images } = await supabase
      .from('property_images')
      .select('property_id, image_url')
      .in('property_id', ids);

    const firstImage = {};
    images?.forEach((img) => {
      if (!firstImage[img.property_id]) firstImage[img.property_id] = img.image_url;
    });

    result = properties.map((p) => ({ ...p, imageUrl: firstImage[p.id] || null }));
  }

  return { properties: result, total: count || 0 };
}

export default async function PropertiesPage({ searchParams }) {
  const sp = searchParams ?? {};
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);

  const filters = {
    listing_type: sp.listing_type ?? '',
    property_type: sp.property_type ?? '',
    city: sp.city ?? '',
    sort: sp.sort ?? '',
    min_price: sp.min_price ?? '',
    max_price: sp.max_price ?? '',
  };

  const { properties, total } = await fetchProperties({ ...filters, page });
  const totalPages = Math.ceil(total / LIMIT);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <main className="container-custom py-12">

      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">Property Listings</p>
        <h1 className="section-title mb-3">Find Your Perfect Property</h1>
        <p className="text-muted text-lg">
          {total > 0
            ? `${total} ${total === 1 ? 'property' : 'properties'} ${hasActiveFilters ? 'matched' : 'available'}`
            : 'Explore our curated collection of premium listings'}
        </p>
      </div>

      {/* Filters */}
      <PropertyFilters filters={filters} />

      {/* Results */}
      <div className="mt-8">
        {properties.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
            <p className="text-3xl mb-3">🏠</p>
            <h3 className="font-bold text-primary text-lg mb-2">No properties found</h3>
            <p className="text-muted text-sm mb-6">Try adjusting your filters or clearing the search.</p>
            <Link href="/properties" className="text-sm text-accent font-semibold hover:underline">
              Clear all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                title={p.title}
                price={formatPrice(p.price)}
                bedrooms={p.bedrooms}
                bathrooms={p.bathrooms}
                area={p.area}
                city={p.city}
                status={p.status}
                listing_type={p.listing_type}
                imageUrl={p.imageUrl}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination page={page} totalPages={totalPages} searchParams={sp} />
        </div>
      )}

      {/* Bottom CTA */}
      <section className="mt-16 bg-surface rounded-xl p-12 text-center border border-border">
        <h2 className="text-3xl font-bold text-primary mb-4">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="text-muted mb-8">Contact our team for personalized property recommendations</p>
        <Link href="/contact" className="btn-primary inline-flex px-8 py-3">
          Get in Touch
        </Link>
      </section>

    </main>
  );
}
