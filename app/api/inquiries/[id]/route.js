import { NextResponse } from 'next/server';
import { inquiryService } from '@/services/inquiries';
import { isSupabaseConfigured } from '@/lib/supabase';
import { z } from 'zod';
import logger from '@/lib/logger';

const updateStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'unqualified', 'closed']),
});

export async function GET(request, { params }) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
    }

    const data = await inquiryService.getById(params.id);
    logger.info(`GET /api/inquiries/${params.id}`);
    return NextResponse.json({ data });
  } catch (error) {
    logger.error(`GET /api/inquiries/${params.id} failed`, error);
    const status = error.code === 'PGRST116' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(request, { params }) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
    }

    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await inquiryService.updateStatus(params.id, parsed.data.status);
    logger.info(`PATCH /api/inquiries/${params.id}`, { status: parsed.data.status });
    return NextResponse.json({ data });
  } catch (error) {
    logger.error(`PATCH /api/inquiries/${params.id} failed`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
    }

    await inquiryService.delete(params.id);
    logger.info(`DELETE /api/inquiries/${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(`DELETE /api/inquiries/${params.id} failed`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
