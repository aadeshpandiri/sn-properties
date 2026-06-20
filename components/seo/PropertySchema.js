const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://snproperties.com';

export default function PropertySchema({ property }) {
  const image = property.property_images?.[0]?.image_url;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description,
    url: `${BASE}/properties/${property.id}`,
    ...(image && { image }),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      availability:
        property.status === 'available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      seller: {
        '@type': 'Organization',
        name: 'SN Properties',
      },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Bedrooms',  value: property.bedrooms },
      { '@type': 'PropertyValue', name: 'Bathrooms', value: property.bathrooms },
      { '@type': 'PropertyValue', name: 'Area (sqft)', value: property.area },
      { '@type': 'PropertyValue', name: 'Type',      value: property.property_type },
      { '@type': 'PropertyValue', name: 'City',      value: property.city },
      {
        '@type': 'PropertyValue',
        name: 'Listing type',
        value: property.listing_type === 'sale' ? 'For Sale' : 'For Rent',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
