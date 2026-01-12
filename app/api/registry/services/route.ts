import { NextRequest, NextResponse } from 'next/server';
import { serviceRegistry, getServicesByCategory } from '@/registry/services';

// GET /api/registry/services - List available services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (category) {
      return NextResponse.json(getServicesByCategory(category as any));
    }

    return NextResponse.json(serviceRegistry);
  } catch (error) {
    console.error('List services error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
