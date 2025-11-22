import { NextResponse } from 'next/server';
import { createCategory, listCategories } from '@/app/lib/store';

export async function GET() {
  return NextResponse.json(listCategories());
}

export async function POST(request) {
  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const category = createCategory(name);
  return NextResponse.json(category, { status: 201 });
}
