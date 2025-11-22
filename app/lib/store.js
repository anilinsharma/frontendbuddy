import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const defaultDb = {
  categories: [
    { id: 'gen-ai', name: 'Generative AI' },
    { id: 'agents', name: 'Autonomous Agents' },
    { id: 'edge', name: 'Edge AI' },
  ],
  writers: [
    { id: 'nova', name: 'Nova Fields', bio: 'Synth designer and prompt engineer.' },
    { id: 'zen', name: 'Zen Rios', bio: 'AI product strategist & signal hunter.' },
  ],
  posts: [
    {
      id: 'launch-burst',
      title: 'Neon Launch: 5 Signals We Track Next Week',
      categoryId: 'gen-ai',
      writerId: 'nova',
      tags: ['roadmap', 'vision'],
      spotlight: true,
      content:
        'We are tracking model scaling, agent reliability, real-time copilots, safety evals, and edge silicon — with concrete UX reads you can ship this sprint.',
      publishedAt: new Date().toISOString(),
    },
  ],
  comments: [
    {
      id: 'c1',
      postId: 'launch-burst',
      author: 'Synth Reader',
      message: 'Excited for the agent reliability breakdown — please add benchmarks!',
      createdAt: new Date().toISOString(),
    },
  ],
};

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2));
  }
}

function readDb() {
  ensureDb();
  const content = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(content);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  return data;
}

export function listPosts() {
  const db = readDb();
  return db.posts.map((post) => ({
    ...post,
    category: db.categories.find((c) => c.id === post.categoryId)?.name || 'Uncategorized',
    writer: db.writers.find((w) => w.id === post.writerId)?.name || 'Unknown',
  }));
}

export function getPost(id) {
  return listPosts().find((post) => post.id === id);
}

export function listCategories() {
  return readDb().categories;
}

export function listWriters() {
  return readDb().writers;
}

export function createCategory(name) {
  const db = readDb();
  const id = name.toLowerCase().replace(/\s+/g, '-');
  if (db.categories.some((c) => c.id === id)) {
    return db.categories.find((c) => c.id === id);
  }
  const category = { id, name };
  db.categories.push(category);
  writeDb(db);
  return category;
}

export function createWriter(payload) {
  const db = readDb();
  const writer = { id: randomUUID(), name: payload.name, bio: payload.bio || '' };
  db.writers.push(writer);
  writeDb(db);
  return writer;
}

export function createPost(payload) {
  const db = readDb();
  const post = {
    id: randomUUID(),
    title: payload.title,
    categoryId: payload.categoryId,
    writerId: payload.writerId,
    tags: payload.tags || [],
    spotlight: Boolean(payload.spotlight),
    content: payload.content || '',
    publishedAt: new Date().toISOString(),
  };
  db.posts.unshift(post);
  writeDb(db);
  return post;
}

export function updatePost(id, payload) {
  const db = readDb();
  const index = db.posts.findIndex((post) => post.id === id);
  if (index === -1) return null;
  db.posts[index] = {
    ...db.posts[index],
    title: payload.title ?? db.posts[index].title,
    categoryId: payload.categoryId ?? db.posts[index].categoryId,
    writerId: payload.writerId ?? db.posts[index].writerId,
    tags: Array.isArray(payload.tags)
      ? payload.tags
      : typeof payload.tags === 'string'
        ? payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : db.posts[index].tags,
    spotlight: payload.spotlight ?? db.posts[index].spotlight,
    content: payload.content ?? db.posts[index].content,
  };
  writeDb(db);
  return db.posts[index];
}

export function listComments(postId) {
  const db = readDb();
  return db.comments.filter((comment) => comment.postId === postId);
}

export function addComment(postId, payload) {
  const db = readDb();
  const postExists = db.posts.some((post) => post.id === postId);
  if (!postExists) return null;
  const comment = {
    id: randomUUID(),
    postId,
    author: payload.author || 'Guest',
    message: payload.message || '',
    createdAt: new Date().toISOString(),
  };
  db.comments.push(comment);
  writeDb(db);
  return comment;
}
