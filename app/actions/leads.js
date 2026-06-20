'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase';

function db() {
  if (!supabaseServer) throw new Error('Database client not initialized');
  return supabaseServer;
}

export async function updateInquiryStatus(id, status) {
  const { error } = await db()
    .from('inquiries')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${id}`);
  return { success: true };
}

export async function deleteInquiry(id) {
  const { error } = await db().from('inquiries').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/inquiries');
  return { success: true };
}

export async function updateVisitStatus(id, status) {
  const { error } = await db()
    .from('schedule_visits')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/visits');
  revalidatePath(`/admin/visits/${id}`);
  return { success: true };
}

export async function deleteVisit(id) {
  const { error } = await db().from('schedule_visits').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/visits');
  return { success: true };
}
