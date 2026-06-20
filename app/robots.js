const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://snproperties.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/login', '/admin/reset-password', '/admin/forgot-password'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
