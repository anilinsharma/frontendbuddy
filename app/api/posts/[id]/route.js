import { NextResponse } from 'next/server';
import { getPost, updatePost, listCategories, listWriters } from '@/app/lib/store';

export async function GET(_, { params }) {
  const post = getPost(params.id);
  if (!post) return NextResponse.json({ error: 'post not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(request, { params }) {
  const payload = await request.json();
  const categories = listCategories();
  const writers = listWriters();

  if (payload.categoryId && !categories.some((c) => c.id === payload.categoryId)) {
    return NextResponse.json({ error: 'valid categoryId is required' }, { status: 400 });
  }
  if (payload.writerId && !writers.some((w) => w.id === payload.writerId)) {
    return NextResponse.json({ error: 'valid writerId is required' }, { status: 400 });
  }

  const updated = updatePost(params.id, payload);
  if (!updated) return NextResponse.json({ error: 'post not found' }, { status: 404 });

  return NextResponse.json(updated);
}
