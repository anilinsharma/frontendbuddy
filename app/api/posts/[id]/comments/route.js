import { NextResponse } from 'next/server';
import { addComment, listComments, getPost } from '@/app/lib/store';

export async function GET(_, { params }) {
  if (!getPost(params.id)) return NextResponse.json({ error: 'post not found' }, { status: 404 });
  return NextResponse.json(listComments(params.id));
}

export async function POST(request, { params }) {
  const payload = await request.json();
  if (!payload.message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }
  const created = addComment(params.id, payload);
  if (!created) return NextResponse.json({ error: 'post not found' }, { status: 404 });
  return NextResponse.json(created, { status: 201 });
}
