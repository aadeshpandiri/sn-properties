import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import PropertyForm from '@/components/admin/PropertyForm';
import { updateProperty } from '@/app/actions/properties';

export const metadata = { title: 'Edit Property — SN Properties Admin' };

async function getProperty(id) {
  if (!supabaseServer) return null;

  const [propertyRes, imagesRes, videosRes] = await Promise.all([
    supabaseServer.from('properties').select('*').eq('id', id).single(),
    supabaseServer.from('property_images').select('id, image_url').eq('property_id', id).order('created_at'),
    supabaseServer.from('property_videos').select('id, video_url').eq('property_id', id).order('created_at'),
  ]);

  if (propertyRes.error) return null;

  return {
    ...propertyRes.data,
    property_images: imagesRes.data ?? [],
    property_videos: videosRes.data ?? [],
  };
}

export default async function EditPropertyPage({ params }) {
  const property = await getProperty(params.id);
  if (!property) notFound();

  const { property_images, property_videos, ...propertyData } = property;
  const updateWithId = updateProperty.bind(null, property.id);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Link href="/admin/properties" className="hover:text-primary transition-colors">
            Properties
          </Link>
          <span>/</span>
          <span className="text-primary truncate max-w-xs">{propertyData.title}</span>
        </div>
        <h1 className="text-2xl font-bold text-primary">Edit Property</h1>
      </div>

      <PropertyForm
        property={propertyData}
        action={updateWithId}
        existingImages={property_images ?? []}
        existingVideos={property_videos ?? []}
      />
    </div>
  );
}
