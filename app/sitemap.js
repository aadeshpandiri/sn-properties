import { supabase } from '@/lib/supabase';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://snproperties.com';

export default async function sitemap() {
  const staticPages = [
    { url: BASE,                   priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE}/properties`,   priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE}/about`,        priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/contact`,      priority: 0.7, changeFrequency: 'monthly' },
  ].map((page) => ({ ...page, lastModified: new Date() }));

  if (!supabase) return staticPages;

  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at')
    .eq('status', 'available');

  const propertyPages = (properties ?? []).map((p) => ({
    url: `${BASE}/properties/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...propertyPages];
}
