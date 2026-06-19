'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROPERTY_TYPES, LISTING_TYPES } from '@/lib/constants';

export default function HeroSearch() {
  const router = useRouter();
  const [listingType, setListingType] = useState('sale');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('listing_type', listingType);
    if (city.trim()) params.set('city', city.trim());
    if (propertyType) params.set('property_type', propertyType);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-xl shadow-hover max-w-3xl mx-auto overflow-hidden"
    >
      {/* Buy / Rent tabs */}
      <div className="flex border-b border-border">
        {LISTING_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setListingType(type.value)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              listingType === type.value
                ? 'bg-primary text-white'
                : 'text-muted hover:text-primary bg-white'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Search fields */}
      <div className="flex flex-col lg:flex-row">
        <input
          type="text"
          placeholder="City or neighborhood..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-5 py-4 text-sm text-primary placeholder:text-muted focus:outline-none border-r border-border"
        />
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="px-5 py-4 text-sm text-primary focus:outline-none bg-white cursor-pointer border-r border-border min-w-[160px]"
        >
          <option value="">All Property Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-accent text-primary font-semibold px-8 py-4 text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Search Properties
        </button>
      </div>
    </form>
  );
}
