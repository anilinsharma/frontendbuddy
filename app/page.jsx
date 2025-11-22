'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SparklesIcon, PlusIcon, TagIcon, BoltIcon, PencilSquareIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

const neonGradient = 'bg-gradient-to-br from-plasma/40 via-midnight to-midnight border border-plasma/30';

async function jsonRequest(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [writers, setWriters] = useState([]);
  const [postForm, setPostForm] = useState({ title: '', categoryId: '', writerId: '', tags: '', content: '', spotlight: false });
  const [editingPostId, setEditingPostId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [writerForm, setWriterForm] = useState({ name: '', bio: '' });
  const [error, setError] = useState('');

  async function hydrate() {
    const [p, c, w] = await Promise.all([
      fetch('/api/posts').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/writers').then((r) => r.json()),
    ]);
    setPosts(p);
    setCategories(c);
    setWriters(w);
    if (!postForm.categoryId && c[0]) setPostForm((f) => ({ ...f, categoryId: c[0].id }));
    if (!postForm.writerId && w[0]) setPostForm((f) => ({ ...f, writerId: w[0].id }));
  }

  useEffect(() => {
    hydrate().catch((e) => setError(e.message));
  }, []);

  const spotlightPosts = useMemo(() => posts.filter((p) => p.spotlight), [posts]);

  async function handlePostSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...postForm,
        tags: postForm.tags
          ? postForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : [],
      };
      if (editingPostId) {
        const updated = await jsonRequest(`/api/posts/${editingPostId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setPosts((prev) =>
          prev.map((post) =>
            post.id === editingPostId
              ? {
                  ...post,
                  ...updated,
                  category: categories.find((c) => c.id === updated.categoryId)?.name || post.category,
                  writer: writers.find((w) => w.id === updated.writerId)?.name || post.writer,
                }
              : post
          )
        );
      } else {
        const created = await jsonRequest('/api/posts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setPosts((prev) => [
          {
            ...created,
            category: categories.find((c) => c.id === created.categoryId)?.name || 'Uncategorized',
            writer: writers.find((w) => w.id === created.writerId)?.name || 'Unknown',
          },
          ...prev,
        ]);
      }
      setEditingPostId('');
      setPostForm((f) => ({ ...f, title: '', tags: '', content: '', spotlight: false }));
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(post) {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      categoryId: post.categoryId,
      writerId: post.writerId,
      tags: post.tags?.join(', ') || '',
      content: post.content || '',
      spotlight: Boolean(post.spotlight),
    });
  }

  function resetPostForm() {
    setEditingPostId('');
    setPostForm((f) => ({ ...f, title: '', tags: '', content: '', spotlight: false }));
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const created = await jsonRequest('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: categoryName }),
      });
      setCategories((prev) => [...prev, created]);
      setCategoryName('');
      if (!postForm.categoryId) setPostForm((f) => ({ ...f, categoryId: created.id }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleWriterSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const created = await jsonRequest('/api/writers', {
        method: 'POST',
        body: JSON.stringify(writerForm),
      });
      setWriters((prev) => [...prev, created]);
      setWriterForm({ name: '', bio: '' });
      if (!postForm.writerId) setPostForm((f) => ({ ...f, writerId: created.id }));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="h-2 w-2 rounded-full bg-neon shadow-glow" />
          <span>Admin Console</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-black/30 px-3 py-1.5 text-sm text-slate-100 transition hover:border-neon hover:text-neon"
            href="/blog"
          >
            Reader mode
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-black/30 px-3 py-1.5 text-sm text-slate-100 transition hover:border-neon hover:text-neon"
            href="/preview"
          >
            Preview
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <header className={`panel glow-border ${neonGradient}`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="p-3 rounded-xl bg-black/30 border border-white/10">
            <SparklesIcon className="h-8 w-8 text-neon" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neon">Futuristic AI Blog</p>
            <h1 className="text-3xl font-bold text-white">Creator Console</h1>
            <p className="text-slate-300 max-w-2xl">
              Add posts, curate categories, and onboard writers. Published dates are auto-generated for each submission.
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div className="panel border-red-500/40 bg-red-950/40 text-red-100">
          <p className="font-semibold">{error}</p>
          <p className="text-sm text-red-200">Check your input and retry.</p>
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="panel glow-border lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-title">
                <PencilSquareIcon className="h-5 w-5 text-neon" /> {editingPostId ? 'Edit Post' : 'New Post'}
              </p>
              <p className="section-subtitle">Title, category, tags, writer, spotlight, and body copy.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge">
                <TagIcon className="h-4 w-4 text-neon" /> Auto date on save
              </span>
              {editingPostId && (
                <button type="button" className="badge hover:border-neon/50" onClick={resetPostForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handlePostSubmit}>
            <label className="md:col-span-2 space-y-2">
              <span className="text-sm text-slate-200">Title</span>
              <input
                className="input"
                placeholder="Post title"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-200">Category</span>
              <select
                className="input"
                value={postForm.categoryId}
                onChange={(e) => setPostForm({ ...postForm, categoryId: e.target.value })}
                required
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-200">Writer</span>
              <select
                className="input"
                value={postForm.writerId}
                onChange={(e) => setPostForm({ ...postForm, writerId: e.target.value })}
                required
              >
                <option value="" disabled>
                  Assign a writer
                </option>
                {writers.map((writer) => (
                  <option key={writer.id} value={writer.id}>
                    {writer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-slate-200">Tags (comma separated)</span>
              <input
                className="input"
                placeholder="ethics, infra, agents"
                value={postForm.tags}
                onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-slate-200">Content</span>
              <textarea
                className="input min-h-[140px]"
                placeholder="Draft a concise, human-friendly take..."
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-neon"
                checked={postForm.spotlight}
                onChange={(e) => setPostForm({ ...postForm, spotlight: e.target.checked })}
              />
              <span className="text-sm text-slate-200">Mark as spotlight</span>
            </label>
            <div className="md:col-span-2 flex justify-end">
              <button className="btn-primary" type="submit">
                <PlusIcon className="h-4 w-4" />
                {editingPostId ? 'Save changes' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="panel glow-border space-y-3">
            <p className="section-title"><BoltIcon className="h-5 w-5 text-neon" /> Spotlight</p>
            <p className="section-subtitle">Flagged posts for hero placement.</p>
            <div className="space-y-3">
              {spotlightPosts.length === 0 ? (
                <p className="text-slate-400 text-sm">No spotlight posts yet.</p>
              ) : (
                spotlightPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2">
                    <div>
                      <p className="font-semibold text-white">{post.title}</p>
                      <p className="text-xs text-slate-400">{post.category} · {post.writer}</p>
                    </div>
                    <span className="badge text-neon">Hero</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel glow-border space-y-3">
            <p className="section-title">Categories</p>
            <form className="flex gap-2" onSubmit={handleCategorySubmit}>
              <input
                className="input"
                placeholder="Add a category"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <button className="btn-ghost" type="submit">
                <PlusIcon className="h-5 w-5" />
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category.id} className="badge border-slate-700 text-slate-200">{category.name}</span>
              ))}
            </div>
          </div>

          <div className="panel glow-border space-y-3">
            <p className="section-title">Writers</p>
            <form className="space-y-3" onSubmit={handleWriterSubmit}>
              <input
                className="input"
                placeholder="Writer name"
                value={writerForm.name}
                onChange={(e) => setWriterForm({ ...writerForm, name: e.target.value })}
                required
              />
              <textarea
                className="input min-h-[90px]"
                placeholder="Optional bio"
                value={writerForm.bio}
                onChange={(e) => setWriterForm({ ...writerForm, bio: e.target.value })}
              />
              <button className="btn-ghost w-full" type="submit">
                <PlusIcon className="h-4 w-4" />
                Add writer
              </button>
            </form>
            <div className="space-y-2 max-h-40 overflow-auto pr-1">
              {writers.map((writer) => (
                <div key={writer.id} className="rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2">
                  <p className="font-semibold text-white">{writer.name}</p>
                  {writer.bio && <p className="text-xs text-slate-400">{writer.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="panel glow-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-title">All Posts</p>
            <p className="section-subtitle">Newest first with auto-generated dates.</p>
          </div>
          <span className="badge text-neon">{posts.length} total</span>
        </div>
        <div className="grid gap-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col gap-2 rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <div className="flex flex-wrap items-center gap-3">
                {post.spotlight && <span className="badge bg-neon/20 text-neon border-neon/40">Spotlight</span>}
                <span className="badge border-slate-700 text-slate-200">{post.category}</span>
                <span className="badge border-slate-700 text-slate-300">{post.writer}</span>
                <span className="text-xs text-slate-500">{new Date(post.publishedAt).toLocaleString()}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                  {post.content && <p className="text-sm text-slate-300 line-clamp-3">{post.content}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(post)}
                  className="badge border-neon/50 text-neon hover:bg-neon/10"
                >
                  Edit
                </button>
              </div>
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge border-slate-800 text-slate-300 bg-black/40">#{tag}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
          {posts.length === 0 && <p className="text-slate-400 text-sm">No posts yet. Start by publishing your first idea.</p>}
        </div>
      </section>
    </main>
  );
}
