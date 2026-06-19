import { NextResponse } from 'next/server';
import { propertyService } from '@/services/properties';
import { propertySchema } from '@/lib/validators';
import { isSupabaseConfigured } from '@/lib/supabase';
import logger from '@/lib/logger';

export async function GET(request) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Database not configured yet' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '12');
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const city = searchParams.get('city');
    const listing_type = searchParams.get('listing_type');
    const property_type = searchParams.get('property_type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const hasFilters = city || listing_type || property_type || minPrice || maxPrice;

    const data = hasFilters
      ? await propertyService.search({ city, listing_type, property_type, minPrice, maxPrice })
      : await propertyService.getAll(limit, offset);

    logger.info('GET /api/properties', { count: data.length });
    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    logger.error('GET /api/properties failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Database not configured yet' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = propertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await propertyService.create(parsed.data);
    logger.info('POST /api/properties', { id: data.id });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    logger.error('POST /api/properties failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
