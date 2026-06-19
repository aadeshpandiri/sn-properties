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

export async function createProperty(data) {
  const parsed = propertySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const slug = await uniqueSlug(generateSlug(parsed.data.title));

  const { error } = await db()
    .from('properties')
    .insert({ ...parsed.data, slug });

  if (error) return { error: error.message };

  revalidatePath('/admin/properties');
  revalidatePath('/');
  return { success: true };
}

export async function updateProperty(id, data) {
  const parsed = propertySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

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
