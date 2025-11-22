import { NextResponse } from 'next/server';
import { createWriter, listWriters } from '@/app/lib/store';

export async function GET() {
  return NextResponse.json(listWriters());
}

export async function POST(request) {
  const payload = await request.json();
  if (!payload.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const writer = createWriter({ name: payload.name, bio: payload.bio });
  return NextResponse.json(writer, { status: 201 });
}
