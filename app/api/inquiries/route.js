import { NextResponse } from 'next/server';
import { inquiryService } from '@/services/inquiries';
import { inquirySchema } from '@/lib/validators';
import { isSupabaseConfigured } from '@/lib/supabase';
import logger from '@/lib/logger';

export async function GET(request) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const data = await inquiryService.getAll(limit, offset);
    logger.info('GET /api/inquiries', { count: data.length });
    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    logger.error('GET /api/inquiries failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
    }

    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await inquiryService.create(parsed.data);
    logger.info('POST /api/inquiries', { id: data.id });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    logger.error('POST /api/inquiries failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
