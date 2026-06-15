'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/property/PropertyCard';
import Button from '@/components/ui/Button';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch
    const mockProperties = [
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
        status: 'Rented',
      },
      {
        id: 4,
        title: 'Family Home with Garden',
        price: '$850,000',
        bedrooms: 4,
        bathrooms: 3,
        area: '3,500',
        city: 'Palo Alto',
        status: 'Available',
      },
    ];
    setProperties(mockProperties);
    setLoading(false);
  }, []);

  const filteredProperties =
    filter === 'all'
      ? properties
      : properties.filter((p) => p.status.toLowerCase() === filter.toLowerCase());

  return (
    <main className="container-custom py-12">
      {/* Header Section */}
      <section className="mb-12">
        <h1 className="section-title text-5xl mb-2">Browse Properties</h1>
        <p className="text-muted text-lg mb-8">
          Discover premium properties across the region
        </p>

        {/* Filter Controls */}
        <div className="flex gap-4 flex-wrap">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            onClick={() => setFilter('all')}
          >
            All Properties
          </Button>
          <Button
            variant={filter === 'available' ? 'primary' : 'ghost'}
            onClick={() => setFilter('available')}
          >
            Available
          </Button>
          <Button
            variant={filter === 'rented' ? 'primary' : 'ghost'}
            onClick={() => setFilter('rented')}
          >
            Rented
          </Button>
        </div>
      </section>

      {/* Properties Grid */}
      <section>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Loading properties...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                title={property.title}
                price={property.price}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                city={property.city}
                status={property.status}
                className="h-full hover:shadow-lg transition-shadow"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">No properties found matching your filter.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mt-16 bg-surface rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Can't find what you're looking for?</h2>
        <p className="text-muted mb-8">Contact our team for personalized property recommendations</p>
        <Button variant="primary" className="px-8 py-3">
          Request a Property
        </Button>
      </section>
    </main>
  );
}
