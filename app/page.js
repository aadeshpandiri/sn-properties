import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PropertyCard from '@/components/property/PropertyCard';
import StarRating from '@/components/ui/StarRating';
import HeroSearch from '@/components/home/HeroSearch';
import OrganizationSchema from '@/components/seo/OrganizationSchema';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'SN Properties — Premium Real Estate Platform',
  description: 'Discover premium properties for sale and rent. Expert guidance, transparent pricing, and exceptional service.',
};

// ── Data helpers ──────────────────────────────────────────────────────────

async function fetchWithImages(query) {
  const { data, error } = await query;
  if (error || !data?.length) return [];

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

const SELECT = 'id, title, price, bedrooms, bathrooms, area, city, status, listing_type, property_type';

async function getHomeProperties() {
  if (!supabase) return { featured: [], latest: [], rentals: [], forSale: [] };

  const base = supabase.from('properties').select(SELECT).eq('status', 'available');

  const [featured, latest, rentals, forSale] = await Promise.all([
    fetchWithImages(base.eq('featured', true).order('created_at', { ascending: false }).limit(3)),
    fetchWithImages(base.order('created_at', { ascending: false }).limit(4)),
    fetchWithImages(base.eq('listing_type', 'rent').order('created_at', { ascending: false }).limit(3)),
    fetchWithImages(base.eq('listing_type', 'sale').order('created_at', { ascending: false }).limit(3)),
  ]);

  return { featured, latest, rentals, forSale };
}

async function getApprovedTestimonials() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('testimonials')
    .select('id, name, rating, review, image_url')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(3);
  return data ?? [];
}

// ── Static content ────────────────────────────────────────────────────────

const features = [
  { icon: '🏆', title: 'Expert Guidance', description: 'Our experienced team provides personalized recommendations tailored to your needs and budget.' },
  { icon: '💰', title: 'Transparent Pricing', description: 'No hidden fees or surprise costs. Complete transparency in every property transaction.' },
  { icon: '⚡', title: 'Fast Processing', description: 'Streamlined processes ensure your property transactions close efficiently.' },
  { icon: '📞', title: '24/7 Support', description: 'Our dedicated support team is always available to assist you at every stage.' },
];

const stats = [
  { value: '500+', label: 'Properties Sold' },
  { value: '$2B+', label: 'Transaction Value' },
  { value: '1,000+', label: 'Happy Clients' },
  { value: '15+', label: 'Years Experience' },
];

// ── Page ──────────────────────────────────────────────────────────────────

function PropertySection({ properties }) {
  if (!properties.length) return null;
  return properties.map((p) => (
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
  ));
}

export default async function Home() {
  const [{ featured, latest, rentals, forSale }, testimonials] = await Promise.all([
    getHomeProperties(),
    getApprovedTestimonials(),
  ]);

  return (
    <main>

      {/* JSON-LD structured data */}
      <OrganizationSchema />

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="bg-primary py-24 lg:py-36">
        <div className="container-custom text-center">
          <span className="section-label">Premium Real Estate</span>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mt-4 mb-6 leading-tight">
            Find Your Dream<br />Property
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-12">
            Discover premium properties for sale and rent across the San Francisco Bay Area.
            Expert guidance and unmatched service, every step of the way.
          </p>
          <HeroSearch />
          <div className="flex gap-4 justify-center mt-10 flex-wrap">
            <Link href="/properties">
              <Button variant="ghostLight" className="px-10 py-3.5">Explore Properties</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" className="px-10 py-3.5">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats bar */}
      <div className="bg-secondary">
        <div className="container-custom py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-accent">{s.value}</p>
                <p className="text-white/50 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. FEATURED PROPERTIES ──────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="section-label">Handpicked for You</span>
              <h2 className="text-4xl font-bold text-primary mt-3">Featured Properties</h2>
              <p className="text-muted mt-3 max-w-xl mx-auto">
                Our expertly curated selection of premium properties available right now
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PropertySection properties={featured} />
            </div>
            <div className="text-center mt-12">
              <Link href="/properties">
                <Button variant="primary" className="px-10 py-3.5">View All Properties</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. LATEST LISTINGS ──────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="section-label">Just Added</span>
              <h2 className="text-4xl font-bold text-primary mt-3">Latest Listings</h2>
              <p className="text-muted mt-3 max-w-xl mx-auto">
                Fresh properties added to our portfolio — be the first to explore
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PropertySection properties={latest} />
            </div>
          </div>
        </section>
      )}

      {/* ── 4. FOR RENT ─────────────────────────────────────────── */}
      {rentals.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="section-label">Rent</span>
                <h2 className="text-4xl font-bold text-primary mt-3">Properties for Rent</h2>
                <p className="text-muted mt-3">Premium rental properties available now</p>
              </div>
              <Link href="/properties?listing_type=rent">
                <Button variant="ghost">View All Rentals</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PropertySection properties={rentals} />
            </div>
          </div>
        </section>
      )}

      {/* ── 5. FOR SALE ─────────────────────────────────────────── */}
      {forSale.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="section-label">Sale</span>
                <h2 className="text-4xl font-bold text-primary mt-3">Properties for Sale</h2>
                <p className="text-muted mt-3">Exceptional properties available for purchase</p>
              </div>
              <Link href="/properties?listing_type=sale">
                <Button variant="ghost">View All For Sale</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PropertySection properties={forSale} />
            </div>
          </div>
        </section>
      )}

      {/* ── 6. ABOUT ────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="h-[480px] bg-gradient-to-br from-surface to-border rounded-xl" />
              <div className="absolute -bottom-6 -right-6 bg-accent text-primary px-8 py-6 rounded-xl shadow-hover">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-sm font-semibold mt-1 opacity-80">Years of Excellence</p>
              </div>
            </div>
            <div>
              <span className="section-label">About Us</span>
              <h2 className="text-4xl font-bold text-primary mt-3 mb-6 leading-snug">
                We Help You Find The Perfect Property
              </h2>
              <p className="text-muted mb-5 leading-relaxed">
                SN Properties is a premium real estate platform dedicated to making property transactions
                seamless, transparent, and accessible. With over 15 years of combined expertise, our team
                brings passion and professionalism to every transaction.
              </p>
              <p className="text-muted mb-10 leading-relaxed">
                Whether you are buying, selling, or renting, we provide the guidance and support you need
                to make informed decisions with confidence and clarity.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/about">
                  <Button variant="primary" className="px-8 py-3.5">Learn More About Us</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" className="px-8 py-3.5">Get in Touch</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-label">Our Advantage</span>
            <h2 className="text-4xl font-bold text-primary mt-3">Why Choose SN Properties?</h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">
              We combine expertise, transparency, and innovation to deliver exceptional results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="p-8 text-center hover:border-accent transition-colors">
                <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center text-3xl mb-5 mx-auto">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-primary mb-3">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats dark band */}
      <section className="py-16 bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-5xl font-bold text-accent mb-2">{s.value}</p>
                <p className="text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. TESTIMONIALS ─────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="section-label">Client Stories</span>
              <h2 className="text-4xl font-bold text-primary mt-3">What Our Clients Say</h2>
              <p className="text-muted mt-3 max-w-xl mx-auto">
                Real experiences from clients who found their perfect property with us
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <Card key={t.id} className="p-8 flex flex-col">
                  <StarRating rating={t.rating} size="text-xl" />
                  <p className="text-muted leading-relaxed my-5 italic flex-1">
                    &ldquo;{t.review}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-5">
                    <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 overflow-hidden">
                      {t.image_url ? (
                        <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        t.name.charAt(0)
                      )}
                    </div>
                    <p className="font-semibold text-primary text-sm">{t.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. CONTACT CTA ──────────────────────────────────────── */}
      <section className="py-24 bg-primary">
        <div className="container-custom text-center">
          <span className="section-label">Get Started Today</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Our team of experts is ready to guide you through every step of the process.
            Let us help you find exactly what you are looking for.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button variant="secondary" className="px-10 py-4 text-base">Contact Our Team</Button>
            </Link>
            <Link href="/properties">
              <Button variant="ghostLight" className="px-10 py-4 text-base">Browse Properties</Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
