import { NextResponse } from 'next/server';
import { getAllCategories } from '@/registry/services';

// GET /api/registry/categories - List service categories
export async function GET() {
  try {
    return NextResponse.json(getAllCategories());
  } catch (error) {
    console.error('List categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
