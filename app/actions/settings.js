'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase';
import { z } from 'zod';

function db() {
  if (!supabaseServer) throw new Error('Database client not initialized');
  return supabaseServer;
}

const settingsSchema = z.object({
  phone:          z.string().min(1, 'Phone is required'),
  email:          z.string().email('Invalid email'),
  address:        z.string().min(5, 'Address is required'),
  hours_weekday:  z.string().min(1, 'Required'),
  hours_saturday: z.string().min(1, 'Required'),
  hours_sunday:   z.string().min(1, 'Required'),
  whatsapp:       z.string().min(1, 'WhatsApp number is required'),
});

export async function saveSettings(data) {
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const now = new Date().toISOString();
  const rows = Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value,
    updated_at: now,
  }));

  const { error } = await db()
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) return { error: error.message };

  revalidatePath('/admin/settings');
  revalidatePath('/contact');
  return { success: true };
}

// ── FAQ actions ──────────────────────────────────────────────────────────

const faqSchema = z.object({
  question:    z.string().min(5, 'Question is required'),
  answer:      z.string().min(10, 'Answer is required'),
  order_index: z.number().int().min(0).default(0),
  active:      z.boolean().default(true),
});

function revalidateFaqs() {
  revalidatePath('/admin/faqs');
  revalidatePath('/contact');
}

export async function createFaq(data) {
  const parsed = faqSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await db().from('faqs').insert(parsed.data);
  if (error) return { error: error.message };

  revalidateFaqs();
  return { success: true };
}

export async function updateFaq(id, data) {
  const parsed = faqSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await db().from('faqs').update(parsed.data).eq('id', id);
  if (error) return { error: error.message };

  revalidateFaqs();
  return { success: true };
}

export async function deleteFaq(id) {
  const { error } = await db().from('faqs').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidateFaqs();
  return { success: true };
}

export async function toggleFaqActive(id, active) {
  const { error } = await db().from('faqs').update({ active }).eq('id', id);
  if (error) return { error: error.message };

  revalidateFaqs();
  return { success: true };
}
