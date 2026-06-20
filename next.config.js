/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'vercel.app',
      'easmscttakkzqtgyqnma.supabase.co',
      'images.unsplash.com',
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Allow up to 10MB file uploads via server actions
    },
  },
};

module.exports = nextConfig;
