import { headers } from 'next/headers';
import '../styles/globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://snproperties.com'),
  title: {
    default: 'SN Properties — Premium Real Estate Platform',
    template: '%s | SN Properties',
  },
  description: 'Discover premium properties for sale and rent in the San Francisco Bay Area. Expert guidance, transparent pricing, and exceptional service.',
  keywords: ['real estate', 'properties for sale', 'properties for rent', 'San Francisco', 'luxury homes', 'apartments', 'villas'],
  authors: [{ name: 'SN Properties' }],
  openGraph: {
    title: 'SN Properties — Premium Real Estate Platform',
    description: 'Discover premium properties for sale and rent. Expert guidance, transparent pricing, and exceptional service.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://snproperties.com',
    siteName: 'SN Properties',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SN Properties — Premium Real Estate Platform',
    description: 'Discover premium properties for sale and rent. Expert guidance and exceptional service.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
};

export default async function RootLayout({ children }) {
  const heads = await headers();
  const pathname = heads.get('x-pathname') ?? '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-text flex flex-col min-h-screen">
        <Providers>
          {!isAdmin && <Navigation />}
          <div className={isAdmin ? 'contents' : 'flex-1'}>
            {children}
          </div>
          {!isAdmin && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
