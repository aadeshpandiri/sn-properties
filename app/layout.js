import '../styles/globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'SN Properties - Premium Real Estate Platform',
  description: 'Discover premium properties for sale and rent. Professional real estate platform with advanced search and detailed property information.',
  keywords: 'real estate, properties, buy, rent, property listings',
  openGraph: {
    title: 'SN Properties - Premium Real Estate Platform',
    description: 'Discover premium properties for sale and rent.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function RootLayout({ children }) {
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
        <Navigation />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
