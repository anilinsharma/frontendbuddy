'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChatBubbleLeftIcon, ShareIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/solid';

function formatDate(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric' }).format(new Date(date));
}

export default function BlogReader() {
  const [posts, setPosts] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ author: '', message: '' });
  const [error, setError] = useState('');
  const activePost = useMemo(() => posts.find((post) => post.id === activeId), [posts, activeId]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        if (data[0]) setActiveId(data[0].id);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!activeId) return;
    fetch(`/api/posts/${activeId}/comments`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => setError(err.message));
  }, [activeId]);

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!activeId) return;
    setError('');
    try {
      const created = await fetch(`/api/posts/${activeId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentForm.author || 'Guest Reader',
          message: commentForm.message,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error('Unable to add comment');
        return res.json();
      });
      setComments((prev) => [...prev, created]);
      setCommentForm({ author: '', message: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleShare(post) {
    if (!post) return;
    const url = `${window.location.origin}/blog#${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.content?.slice(0, 120), url });
        return;
      } catch (e) {
        // ignore and fall back to copy
      }
    }
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard');
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-black/40 px-3 py-1 text-sm text-slate-200 transition hover:border-neon hover:text-neon"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Admin console
        </Link>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <ChatBubbleLeftIcon className="h-5 w-5 text-neon" />
          Reader mode — simple, human-friendly
        </div>
      </div>

      {error && <div className="panel border-red-500/40 bg-red-950/40 text-red-100 mb-6">{error}</div>}

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="panel glow-border space-y-4">
          {activePost ? (
            <>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="badge border-slate-800 bg-black/60 text-slate-200">{activePost.category}</span>
                <span className="badge border-slate-800 bg-black/60 text-slate-200">{activePost.writer}</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <ClockIcon className="h-4 w-4" /> {formatDate(activePost.publishedAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white">{activePost.title}</h1>
              {activePost.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activePost.tags.map((tag) => (
                    <span key={tag} className="badge border-slate-700 bg-black/40 text-slate-200">#{tag}</span>
                  ))}
                </div>
              )}
              <p className="text-slate-200 leading-relaxed whitespace-pre-line">{activePost.content || 'No content added yet.'}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => handleShare(activePost)}
                  type="button"
                >
                  <ShareIcon className="h-5 w-5" /> Share
                </button>
                <a
                  className="btn-ghost inline-flex items-center gap-2"
                  href={`mailto:?subject=${encodeURIComponent(activePost.title)}&body=${encodeURIComponent(activePost.content || '')}`}
                >
                  Email
                </a>
              </div>
            </>
          ) : (
            <p className="text-slate-400">No posts to read yet. Publish from the console.</p>
          )}
        </article>

        <aside className="space-y-4">
          <div className="panel glow-border space-y-3">
            <p className="section-title">Latest posts</p>
            <div className="space-y-2 max-h-[380px] overflow-auto pr-1">
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setActiveId(post.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                    activeId === post.id
                      ? 'border-neon/50 bg-neon/10 text-white'
                      : 'border-white/5 bg-black/30 text-slate-200 hover:border-neon/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{post.category}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <p className="font-semibold text-white">{post.title}</p>
                  {post.content && <p className="text-xs text-slate-400 line-clamp-2">{post.content}</p>}
                </button>
              ))}
              {posts.length === 0 && <p className="text-slate-500 text-sm">No posts yet.</p>}
            </div>
          </div>

          <div className="panel glow-border space-y-3">
            <div className="flex items-center justify-between">
              <p className="section-title flex items-center gap-2">
                <ChatBubbleLeftIcon className="h-5 w-5 text-neon" /> Comments
              </p>
              <span className="badge text-neon">{comments.length}</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-white/5 bg-black/40 p-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{comment.author}</span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-line">{comment.message}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-slate-500 text-sm">Be first to respond.</p>}
            </div>
            <form className="space-y-2" onSubmit={handleCommentSubmit}>
              <input
                className="input"
                placeholder="Name (optional)"
                value={commentForm.author}
                onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
              />
              <textarea
                className="input min-h-[90px]"
                placeholder="Share your thoughts"
                value={commentForm.message}
                onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                required
              />
              <button className="btn-primary w-full" type="submit" disabled={!activeId}>
                Post comment
              </button>
            </form>
          </div>
        </aside>
      </section>
    </main>
  );
}
