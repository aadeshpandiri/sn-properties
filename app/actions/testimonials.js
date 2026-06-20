'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase';
import { testimonialSchema } from '@/lib/validators';

function db() {
  if (!supabaseServer) throw new Error('Database client not initialized');
  return supabaseServer;
}

function revalidateAll() {
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}

export async function createTestimonial(data) {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await db().from('testimonials').insert(parsed.data);
  if (error) return { error: error.message };

  revalidateAll();
  return { success: true };
}

export async function updateTestimonial(id, data) {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await db().from('testimonials').update(parsed.data).eq('id', id);
  if (error) return { error: error.message };

  revalidateAll();
  return { success: true };
}

export async function deleteTestimonial(id) {
  const { error } = await db().from('testimonials').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidateAll();
  return { success: true };
}

export async function toggleApproval(id, approved) {
  const { error } = await db().from('testimonials').update({ approved }).eq('id', id);
  if (error) return { error: error.message };

  revalidateAll();
  return { success: true };
}
