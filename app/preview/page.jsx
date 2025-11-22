import { SparklesIcon, BoltIcon, FireIcon, TagIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { listPosts } from '@/app/lib/store';

export const revalidate = 0;

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
  }).format(new Date(date));
}

export default async function PreviewPage() {
  const posts = listPosts();
  const spotlight = posts.find((post) => post.spotlight) ?? posts[0];
  const latest = posts.slice(0, 4);
  const tags = Array.from(
    posts.reduce((set, post) => {
      (post.tags || []).forEach((tag) => set.add(tag));
      return set;
    }, new Set())
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <nav className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-black/30 px-3 py-1.5 text-sm text-slate-200 transition hover:border-neon hover:text-neon"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to admin
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <SparklesIcon className="h-5 w-5 text-neon" />
          Futuristic AI Blog — Preview
        </div>
      </nav>

      {spotlight && (
        <section className="relative overflow-hidden rounded-2xl border border-plasma/40 bg-gradient-to-br from-plasma/30 via-midnight to-midnight p-8 shadow-glow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(108,246,255,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.12),transparent_35%)]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr] items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neon border border-neon/40">Spotlight</p>
              <h1 className="text-3xl font-bold text-white md:text-4xl">{spotlight.title}</h1>
              <p className="text-slate-200 text-sm">
                Hero-ready article surfaced from your latest entries. Categories and tags reflect live content.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="badge border-neon/40 bg-neon/20 text-neon">{spotlight.category}</span>
                <span className="badge border-white/15 text-slate-200">By {spotlight.writer}</span>
                <span className="text-slate-400">{formatDate(spotlight.publishedAt)}</span>
              </div>
              {spotlight.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {spotlight.tags.map((tag) => (
                    <span key={tag} className="badge border-slate-800 bg-black/60 text-slate-200">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
              <div className="absolute inset-0 rounded-2xl border border-white/5" />
              <div className="relative z-10 space-y-3">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Latest signal</p>
                <div className="flex items-center gap-3 text-lg font-semibold text-white">
                  <BoltIcon className="h-6 w-6 text-neon" />
                  {formatDate(spotlight.publishedAt)}
                </div>
                <p className="text-sm text-slate-300">
                  This preview reads directly from your stored posts so you can validate spotlight copy before shipping.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
        <div className="panel glow-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title"><FireIcon className="h-5 w-5 text-neon" /> Latest drops</p>
              <p className="section-subtitle">Newest posts with live meta.</p>
            </div>
            <span className="badge text-neon">{latest.length} shown</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {latest.map((post) => (
              <article key={post.id} className="flex flex-col gap-2 rounded-xl border border-white/5 bg-slate-900/40 p-4 shadow-inner">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="badge border-slate-800 text-slate-200">{post.category}</span>
                  <span className="badge border-slate-800 text-slate-300">{post.writer}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="badge border-slate-800 bg-black/60 text-slate-300">#{tag}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {latest.length === 0 && <p className="text-slate-400 text-sm">No posts yet — publish from the console.</p>}
          </div>
        </div>

        <aside className="panel glow-border space-y-4">
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-neon" />
            <div>
              <p className="section-title">Signal tags</p>
              <p className="section-subtitle">Auto-collected from live posts.</p>
            </div>
          </div>
          {tags.length === 0 ? (
            <p className="text-slate-400 text-sm">Tags will appear once your posts include them.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="badge border-slate-800 bg-black/50 text-slate-200">#{tag}</span>
              ))}
            </div>
          )}
          <div className="rounded-xl border border-white/5 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
            The preview pulls directly from your JSON-backed API. Swap `app/lib/store.js` to another database to keep this page in sync.
          </div>
        </aside>
      </section>
    </main>
  );
}
