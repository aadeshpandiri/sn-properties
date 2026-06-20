const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://snproperties.com';

export default function OrganizationSchema({ phone, email, address }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'SN Properties',
    url: BASE,
    logo: `${BASE}/logo.png`,
    description: 'Premium real estate platform for buying and renting properties in the San Francisco Bay Area.',
    ...(phone   && { telephone: phone }),
    ...(email   && { email }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
      },
    }),
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
