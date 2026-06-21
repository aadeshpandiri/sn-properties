'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase';
import { propertySchema } from '@/lib/validators';
import { generateSlug } from '@/lib/utils';

function db() {
  if (!supabaseServer) throw new Error('Admin database client not initialized');
  return supabaseServer;
}

async function uniqueSlug(base, excludeId = null) {
  let slug = base;
  let n = 2;
  while (true) {
    let query = db().from('properties').select('id').eq('slug', slug);
    if (excludeId) query = query.neq('id', excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = `${base}-${n++}`;
  }
}

// ── Property CRUD ──────────────────────────────────────────────────────────

export async function createProperty(data) {
  const parsed = propertySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const slug = await uniqueSlug(generateSlug(parsed.data.title));

  const { data: property, error } = await db()
    .from('properties')
    .insert({ ...parsed.data, slug })
    .select('id')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/admin/properties');
  revalidatePath('/');
  return { success: true, id: property.id }; // id needed for image/video association
}

export async function updateProperty(id, data) {
  const parsed = propertySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await db()
    .from('properties')
    .update(parsed.data)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/properties');
  revalidatePath('/');
  revalidatePath(`/properties/${id}`);
  return { success: true };
}

export async function deleteProperty(id) {
  const { error } = await db()
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/properties');
  revalidatePath('/');
  return { success: true };
}

export async function toggleFeatured(id, featured) {
  const { error } = await db()
    .from('properties')
    .update({ featured })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/properties');
  revalidatePath('/');
  return { success: true };
}

// ── Media ──────────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadPropertyImage(formData) {
  const file = formData.get('file');
  if (!file || typeof file === 'string') return { error: 'No file provided' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { error: 'Invalid file type — use JPG, PNG, or WEBP' };
  if (file.size > MAX_IMAGE_SIZE) return { error: 'File too large — max 5 MB' };

  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await db().storage
    .from('property-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data: { publicUrl } } = db().storage
    .from('property-images')
    .getPublicUrl(data.path);

  return { success: true, url: publicUrl, path: data.path };
}

export async function savePropertyImages(propertyId, imageUrls) {
  if (!imageUrls?.length) return { success: true };

  const records = imageUrls.map((url) => ({ property_id: propertyId, image_url: url }));

  const { error } = await db().from('property_images').insert(records);
  if (error) return { error: error.message };

  revalidatePath('/admin/properties');
  revalidatePath('/properties', 'layout');
  revalidatePath('/');
  return { success: true };
}

export async function deletePropertyImage(imageId, imageUrl) {
  // Extract storage path from public URL and delete from storage
  if (imageUrl) {
    const path = imageUrl.split('/property-images/')[1];
    if (path) {
      await db().storage.from('property-images').remove([path]);
    }
  }

  const { error } = await db().from('property_images').delete().eq('id', imageId);
  if (error) return { error: error.message };

  // Revalidate all affected pages so the deleted image stops appearing
  revalidatePath('/admin/properties');
  revalidatePath('/properties', 'layout'); // covers /properties/[id] detail pages
  revalidatePath('/');
  return { success: true };
}

export async function savePropertyVideos(propertyId, videoUrls) {
  if (!videoUrls?.length) return { success: true };

  const records = videoUrls.map((url) => ({ property_id: propertyId, video_url: url }));

  const { error } = await db().from('property_videos').insert(records);
  if (error) return { error: error.message };

  revalidatePath('/admin/properties');
  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/properties/${propertyId}`);
  revalidatePath('/');
  return { success: true };
}

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB

export async function uploadPropertyVideo(formData) {
  const file = formData.get('file');
  if (!file || typeof file === 'string') return { error: 'No file provided' };
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) return { error: 'Invalid type — use MP4, MOV, or WEBM' };
  if (file.size > MAX_VIDEO_SIZE) return { error: 'File too large — max 200 MB' };

  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await db().storage
    .from('property-videos')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data: { publicUrl } } = db().storage
    .from('property-videos')
    .getPublicUrl(data.path);

  return { success: true, url: publicUrl };
}

export async function deletePropertyVideo(videoId, videoUrl) {
  if (videoUrl) {
    const path = videoUrl.split('/property-videos/')[1];
    if (path) await db().storage.from('property-videos').remove([path]);
  }

  const { error } = await db().from('property_videos').delete().eq('id', videoId);
  if (error) return { error: error.message };
  return { success: true };
}
