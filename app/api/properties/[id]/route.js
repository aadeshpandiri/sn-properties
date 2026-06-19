import { NextResponse } from 'next/server';
import { propertyService } from '@/services/properties';
import { propertySchema } from '@/lib/validators';
import { isSupabaseConfigured } from '@/lib/supabase';
import logger from '@/lib/logger';

export async function GET(request, { params }) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
    }

    const data = await propertyService.getById(params.id);
    logger.info(`GET /api/properties/${params.id}`);
    return NextResponse.json({ data });
  } catch (error) {
    logger.error(`GET /api/properties/${params.id} failed`, error);
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
    const parsed = propertySchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await propertyService.update(params.id, parsed.data);
    logger.info(`PATCH /api/properties/${params.id}`);
    return NextResponse.json({ data });
  } catch (error) {
    logger.error(`PATCH /api/properties/${params.id} failed`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
    }

    await propertyService.delete(params.id);
    logger.info(`DELETE /api/properties/${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(`DELETE /api/properties/${params.id} failed`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
