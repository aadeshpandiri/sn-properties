'use server';

import { supabaseServer } from '@/lib/supabase';
import { inquirySchema, scheduleVisitSchema } from '@/lib/validators';

function db() {
  if (!supabaseServer) throw new Error('Database client not initialized');
  return supabaseServer;
}

export async function submitInquiry(data) {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await db().from('inquiries').insert(parsed.data);
  if (error) return { error: error.message };

  return { success: true };
}

export async function scheduleVisit(data) {
  const parsed = scheduleVisitSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await db().from('schedule_visits').insert(parsed.data);
  if (error) return { error: error.message };

  return { success: true };
}
