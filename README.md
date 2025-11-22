# FrontendBuddy – AI Blog Admin (Next.js)

A futuristic AI blog console built with Next.js 14 and Tailwind CSS. It lets you:

- Create posts with title, category, tags, assigned writer, spotlight toggle, body content, and auto-stamped publish date.
- Edit existing posts from the admin list, without losing spotlight flags or tags.
- Manage categories and writer profiles from the same screen.
- Let readers view posts, share links (hash-permalinks), and leave comments on `/blog`.
- Persist data locally in a JSON file by default while keeping API routes ready for a database.

## Stack
- Next.js App Router with API routes for posts, categories, and writers
- Tailwind CSS for the neon/glass UI
- File-backed store (`data/db.json`) for local persistence (swap for SQLite/Supabase when ready)

## Running locally
1. Install deps: `npm install`
2. Start the dev server: `npm run dev`
3. Open `http://localhost:3000` to use the creator console, `http://localhost:3000/blog` for the reader experience, or `http://localhost:3000/preview` to see the live blog preview.

## API surface
- `GET /api/posts` — list posts (with category & writer labels)
- `POST /api/posts` — create post `{ title, content?, categoryId, writerId, tags?: string[] | comma string, spotlight?: boolean }`; `publishedAt` auto-filled server-side.
- `GET /api/posts/:id` — fetch single post
- `PATCH /api/posts/:id` — edit title/content/category/writer/tags/spotlight without changing publish date
- `GET /api/posts/:id/comments` — list comments for a post
- `POST /api/posts/:id/comments` — add a comment `{ author?, message }`
- `GET /api/categories` / `POST /api/categories` — list or create category `{ name }` (slug auto-generated)
- `GET /api/writers` / `POST /api/writers` — list or create writer `{ name, bio? }`

## Database suggestion (free-friendly)
The repo ships with a JSON file store for quick demos. For a free hosted or durable option, swap the store module to:
- **SQLite/Prisma** (zero-cost locally, easy to host on fly.io or Render free tiers)
- **Supabase** free tier (Postgres + auth + storage) using the same API route shapes

Update `app/lib/store.js` to point at your chosen DB while keeping the route handlers intact.
