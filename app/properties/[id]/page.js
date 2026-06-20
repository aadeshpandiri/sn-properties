import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer, supabase } from '@/lib/supabase';
import { formatDate, formatPrice } from '@/lib/utils';
import ImageGallery from '@/components/property/ImageGallery';
import VideoTour from '@/components/property/VideoTour';
import PropertySidebar from '@/components/property/PropertySidebar';
import PropertyCard from '@/components/property/PropertyCard';
import PropertySchema from '@/components/seo/PropertySchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

// ── Data fetching ─────────────────────────────────────────────────────────

async function getProperty(id) {
  if (!supabaseServer) return null;

  const [propRes, imagesRes, videosRes] = await Promise.all([
    supabaseServer.from('properties').select('*').eq('id', id).single(),
    supabaseServer.from('property_images').select('id, image_url').eq('property_id', id).order('created_at'),
    supabaseServer.from('property_videos').select('id, video_url').eq('property_id', id).order('created_at'),
  ]);

  if (propRes.error) return null;

  return {
    ...propRes.data,
    property_images: imagesRes.data ?? [],
    property_videos: videosRes.data ?? [],
  };
}

async function getRelated(property) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('properties')
    .select('id, title, price, bedrooms, bathrooms, area, city, status, listing_type')
    .eq('status', 'available')
    .eq('listing_type', property.listing_type)
    .neq('id', property.id)
    .limit(3);

  if (!data?.length) return [];

  const ids = data.map((p) => p.id);
  const { data: images } = await supabase
    .from('property_images')
    .select('property_id, image_url')
    .in('property_id', ids);

  const firstImage = {};
  images?.forEach((img) => {
    if (!firstImage[img.property_id]) firstImage[img.property_id] = img.image_url;
  });

  return data.map((p) => ({ ...p, imageUrl: firstImage[p.id] || null }));
}

// ── Dynamic metadata ───────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const property = await getProperty(params.id);
  if (!property) return { title: 'Property Not Found — SN Properties' };

  const image = property.property_images?.[0]?.image_url;
  return {
    title: `${property.title} — SN Properties`,
    description: property.description?.slice(0, 155),
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 155),
      ...(image && { images: [{ url: image }] }),
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────

const PROPERTY_TYPE_LABELS = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa',
  commercial: 'Commercial',
  land: 'Land',
};

export default async function PropertyDetailPage({ params }) {
  const [property, related] = await Promise.all([
    getProperty(params.id),
    // related fetched after property resolves — done in render below
    Promise.resolve(null),
  ]);

  if (!property) notFound();

  const relatedProperties = await getRelated(property);

  const specs = [
    { label: 'Bedrooms', value: property.bedrooms, icon: '🛏' },
    { label: 'Bathrooms', value: property.bathrooms, icon: '🚿' },
    { label: 'Area', value: `${property.area?.toLocaleString()} sqft`, icon: '📐' },
    { label: 'Type', value: PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type, icon: '🏠' },
    ...(property.availability_date ? [{ label: 'Available', value: formatDate(property.availability_date), icon: '📅' }] : []),
  ];

  return (
    <main className="container-custom py-10">

      {/* JSON-LD structured data */}
      <PropertySchema property={property} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Properties', href: '/properties' },
        { name: property.title },
      ]} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
        <span>/</span>
        <span className="text-primary truncate max-w-xs">{property.title}</span>
      </nav>

      {/* Image gallery */}
      <div className="mb-8">
        <ImageGallery images={property.property_images} title={property.title} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT: Property details ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Title + location + badges */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-primary leading-tight">{property.title}</h1>
                <p className="text-muted mt-1.5 flex items-center gap-1.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.address}, {property.city}
                </p>
              </div>
              {property.featured && (
                <span className="text-xs font-semibold px-3 py-1.5 bg-accent/10 text-accent rounded-full whitespace-nowrap">
                  ★ Featured
                </span>
              )}
            </div>
          </div>

          {/* Key specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {specs.map((spec) => (
              <div key={spec.label} className="card p-4 text-center">
                <p className="text-2xl mb-1">{spec.icon}</p>
                <p className="font-semibold text-primary text-sm">{spec.value}</p>
                <p className="text-xs text-muted mt-0.5">{spec.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-primary mb-3">About this Property</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* Video tour */}
          {property.property_videos?.length > 0 && (
            <VideoTour videos={property.property_videos} />
          )}

          {/* Related properties */}
          {relatedProperties.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Similar Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedProperties.map((p) => (
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
            </div>
          )}

        </div>

        {/* ── RIGHT: Sticky sidebar ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <PropertySidebar property={property} />
          </div>
        </div>

      </div>
    </main>
  );
}
