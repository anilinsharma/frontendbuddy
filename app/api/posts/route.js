import { NextResponse } from 'next/server';
import { createPost, listPosts, listCategories, listWriters, getPost } from '@/app/lib/store';

export async function GET() {
  const posts = listPosts();
  return NextResponse.json(posts);
}

export async function POST(request) {
  const payload = await request.json();
  const categories = listCategories();
  const writers = listWriters();

  if (!payload.title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  if (!payload.categoryId || !categories.some((c) => c.id === payload.categoryId)) {
    return NextResponse.json({ error: 'valid categoryId is required' }, { status: 400 });
  }

  if (!payload.writerId || !writers.some((w) => w.id === payload.writerId)) {
    return NextResponse.json({ error: 'valid writerId is required' }, { status: 400 });
  }

  if (payload.content && payload.content.length > 4000) {
    return NextResponse.json({ error: 'content is too long' }, { status: 400 });
  }

  const post = createPost({
    title: payload.title,
    categoryId: payload.categoryId,
    writerId: payload.writerId,
    tags: Array.isArray(payload.tags)
      ? payload.tags
      : typeof payload.tags === 'string' && payload.tags
        ? payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
    spotlight: Boolean(payload.spotlight),
    content: payload.content || '',
  });

  return NextResponse.json(getPost(post.id), { status: 201 });
}
