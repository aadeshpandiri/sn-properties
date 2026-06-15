'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PropertyCard from '@/components/property/PropertyCard';
import ImageGallery from '@/components/ui/ImageGallery';

export default function Home() {
  const featuredProperties = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      price: '$450,000',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,200',
      city: 'San Francisco',
      status: 'Available',
    },
    {
      id: 2,
      title: 'Luxury Penthouse Suite',
      price: '$1,200,000',
      bedrooms: 3,
      bathrooms: 3,
      area: '2,500',
      city: 'San Francisco',
      status: 'Available',
    },
    {
      id: 3,
      title: 'Cozy Studio',
      price: '$250,000',
      bedrooms: 1,
      bathrooms: 1,
      area: '600',
      city: 'Oakland',
      status: 'Available',
    },
  ];

  const features = [
    {
      title: 'Expert Guidance',
      description:
        'Our experienced team provides personalized recommendations tailored to your needs and budget.',
      icon: '🏆',
    },
    {
      title: 'Transparent Pricing',
      description: 'No hidden fees or surprise costs. Complete transparency in every transaction.',
      icon: '💰',
    },
    {
      title: 'Fast Processing',
      description: 'Streamlined processes ensure your property transactions are completed efficiently.',
      icon: '⚡',
    },
    {
      title: '24/7 Support',
      description: 'Our dedicated support team is always available to assist you.',
      icon: '📞',
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="container-custom py-20">
        <div className="text-center mb-12">
          <h1 className="section-title text-5xl md:text-6xl mb-4">Welcome to SN Properties</h1>
          <p className="text-muted mb-8 text-lg max-w-2xl mx-auto">
            Your premier platform for discovering premium real estate opportunities across the
            region.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/properties">
              <Button variant="primary" className="px-8 py-3">
                Explore Properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" className="px-8 py-3">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container-custom py-16 bg-surface rounded-lg mb-12">
        <h2 className="text-4xl font-bold text-primary mb-2 text-center">Featured Properties</h2>
        <p className="text-muted text-center mb-12">
          Check out our handpicked selection of premium properties
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              title={property.title}
              price={property.price}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              city={property.city}
              status={property.status}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/properties">
            <Button variant="primary">View All Properties</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-16">
        <h2 className="text-4xl font-bold text-primary mb-2 text-center">Why Choose SN Properties?</h2>
        <p className="text-muted text-center mb-12">
          We combine expertise, transparency, and innovation
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg text-primary mb-3">{feature.title}</h3>
              <p className="text-muted text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-16">
        <Card className="p-12 bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Find Your Perfect Property?</h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            Our team is ready to help you navigate the real estate market with confidence and ease.
          </p>
          <Link href="/contact">
            <Button variant="primary" className="px-8 py-3">
              Contact Our Team
            </Button>
          </Link>
        </Card>
      </section>

      {/* Newsletter Section */}
      <section className="container-custom py-16">
        <Card className="p-8 border-2 border-primary/20">
          <h3 className="text-2xl font-bold text-primary mb-2 text-center">Stay Updated</h3>
          <p className="text-muted text-center mb-6">
            Subscribe to our newsletter for the latest property listings and market insights.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-md border border-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button variant="primary">Subscribe</Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
