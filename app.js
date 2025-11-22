const posts = [
  {
    title: "Agent swarms for frontend teams",
    category: "Playbook",
    summary: "Coordinate autonomous agents to triage bugs, ship PRs, and keep design tokens synced in real time.",
    tags: ["agents", "frontend", "automation"],
    date: "2024-06-04",
    isNew: true,
    spotlight: true,
  },
  {
    title: "Voice-first UI patterns for AI copilots",
    category: "Design",
    summary: "How to design latency-aware interactions, error recovery, and confirmations for voice-driven flows.",
    tags: ["voice", "ux", "copilots"],
    date: "2024-06-01",
    isNew: true,
  },
  {
    title: "Building realtime RAG dashboards with WebGL",
    category: "Build log",
    summary: "Stream embeddings, animate similarity maps, and debug retrieval drift visually with GPU-powered charts.",
    tags: ["rag", "webgl", "visualization"],
    date: "2024-05-28",
  },
  {
    title: "Latency budgets for multimodal apps",
    category: "Guide",
    summary: "Benchmarks and budgets for juggling vision, audio, and text models without breaking UX.",
    tags: ["multimodal", "performance", "metrics"],
    date: "2024-05-26",
  },
  {
    title: "Evaluating copilots with scenario tests",
    category: "Testing",
    summary: "Ship safer copilots using scripted scenarios, assertions, and telemetry driven evals.",
    tags: ["evals", "copilots", "testing"],
    date: "2024-05-23",
  },
  {
    title: "Edge AI UX: offline-first patterns",
    category: "Product",
    summary: "Blend on-device models with cloud fallbacks, graceful degradation, and sync-safe UI states.",
    tags: ["edge", "offline", "ux"],
    date: "2024-05-20",
  },
  {
    title: "Promptable design systems",
    category: "Design",
    summary: "Design tokens that models understand: naming, constraints, and semantics that improve generations.",
    tags: ["design systems", "prompts", "tokens"],
    date: "2024-05-18",
  },
  {
    title: "From playground to product: shipping AI features",
    category: "Strategy",
    summary: "Launch checklist covering consent, telemetry, safety rails, and progressive rollout for AI surfaces.",
    tags: ["product", "launch", "ai safety"],
    date: "2024-05-16",
  },
  {
    title: "When to use on-device vs cloud models",
    category: "Guide",
    summary: "Pick the right deployment targets by balancing privacy, latency, and update cadence.",
    tags: ["edge", "cloud", "architecture"],
    date: "2024-05-14",
  },
  {
    title: "Designing for uncertainty",
    category: "Design",
    summary: "Progressive disclosure, guardrails, and microcopy that guide users through probabilistic systems.",
    tags: ["ux", "guardrails", "writing"],
    date: "2024-05-12",
  },
  {
    title: "LLM-assisted accessibility",
    category: "Accessibility",
    summary: "Use models to generate alt text, adapt motion, and personalize density without losing control.",
    tags: ["accessibility", "llm", "personalization"],
    date: "2024-05-10",
  },
  {
    title: "Data viz prompts that actually work",
    category: "Visualization",
    summary: "Prompt scaffolds that translate messy questions into clear charts and dashboards.",
    tags: ["prompts", "data viz", "analysis"],
    date: "2024-05-08",
  },
  {
    title: "Micro-interactions for AI latency",
    category: "UX",
    summary: "Design shimmer states, intent capture, and fallbacks that respect model variability.",
    tags: ["ux", "latency", "microcopy"],
    date: "2024-05-06",
  },
  {
    title: "Synthetic data for frontend QA",
    category: "Testing",
    summary: "Bootstrap regression suites by letting models generate fixtures that mirror edge users.",
    tags: ["testing", "synthetic", "qa"],
    date: "2024-05-04",
    spotlight: true,
  },
  {
    title: "Realtime translations in design tools",
    category: "Localization",
    summary: "Add on-canvas translations with streaming models and maintain layout integrity.",
    tags: ["localization", "multimodal", "streaming"],
    date: "2024-05-02",
  },
];

const trends = [
  {
    title: "Agentic workflows",
    level: "High",
    summary: "Swarms orchestrated by planners are moving from research to production-quality dev tools.",
  },
  {
    title: "On-device everything",
    level: "Rising",
    summary: "Quantized models and efficient runtimes push privacy-first experiences to mobile and edge.",
  },
  {
    title: "Multimodal UX",
    level: "Breaking",
    summary: "Audio + vision + text stacks are unlocking radically faster input patterns for prosumers.",
  },
  {
    title: "Evaluations & safety",
    level: "Essential",
    summary: "Scenario-driven evals, red-teaming, and live metrics are now table stakes for launches.",
  },
  {
    title: "Autonomous QA",
    level: "Rising",
    summary: "Regression sweeps powered by synthetic data are reducing manual QA load on FE teams.",
  },
  {
    title: "Realtime RAG",
    level: "Breakout",
    summary: "Streaming search + GPU viz tools make knowledge retrieval feel instant and transparent.",
  },
];

const spotlight = [
  {
    title: "Pattern library: AI command palettes",
    copy: "Interaction patterns, latency hints, and failure modes for high-trust palettes.",
    length: "7 min read",
  },
  {
    title: "Code recipe: streaming UI with SSE",
    copy: "Lightweight SSE utilities, buffering UX, and retry strategies with demo code.",
    length: "5 min read",
  },
  {
    title: "Workshop: agent-ready design tokens",
    copy: "How to tag tokens and components so agents respect spacing, motion, and brand rules.",
    length: "Live session",
  },
  {
    title: "Checklist: AI feature launch",
    copy: "Consent, observability, fallback states, and ethical review packaged as a preflight.",
    length: "Printable",
  },
];

const state = {
  filter: "all",
  query: "",
  sort: "newest",
};

function createPostCard(post) {
  const wrapper = document.createElement("article");
  wrapper.className = "card";

  wrapper.innerHTML = `
    <div class="meta">
      <span>${post.category}</span>
      <span aria-hidden="true">•</span>
      <span>${new Date(post.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
    </div>
    <h3>${post.title}</h3>
    <p class="summary">${post.summary}</p>
    <div class="tags">${post.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
  `;

  if (post.isNew) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "New";
    wrapper.appendChild(badge);
  }

  return wrapper;
}

function getFilteredPosts() {
  const query = state.query.trim().toLowerCase();
  const byTag = posts.filter((p) => state.filter === "all" || p.tags.includes(state.filter));
  if (!query) return byTag;

  return byTag.filter((p) => {
    const haystack = `${p.title} ${p.summary} ${p.tags.join(" ")}`.toLowerCase();
    return haystack.includes(query);
  });
}

function sortPosts(list) {
  const sorted = [...list];
  if (state.sort === "title") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (state.sort === "spotlight") {
    return sorted.sort((a, b) => {
      const spotlightScore = (b.spotlight === true) - (a.spotlight === true);
      if (spotlightScore !== 0) return spotlightScore;
      return new Date(b.date) - new Date(a.date);
    });
  }

  return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderPosts() {
  const grid = document.getElementById("latest-grid");
  grid.innerHTML = "";

  const filtered = sortPosts(getFilteredPosts());

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `<strong>No drops match that query.</strong><br />Try another tag or keyword.`;
    grid.appendChild(empty);
  } else {
    filtered.forEach((post) => grid.appendChild(createPostCard(post)));
  }

  document.getElementById("stat-posts").textContent = filtered.length.toString().padStart(2, "0");
}

function renderFilters() {
  const filters = document.getElementById("filters");
  const tagSet = new Set();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  const tags = ["all", ...Array.from(tagSet).sort()];

  tags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (tag === state.filter ? " active" : "");
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.filter = tag;
      renderPosts();
    });
    filters.appendChild(btn);
  });
}

function renderTrends() {
  const grid = document.getElementById("trend-grid");
  trends.forEach((trend) => {
    const card = document.createElement("article");
    card.className = "trend-card";
    card.innerHTML = `
      <div class="level">${trend.level}</div>
      <div class="trend-title">${trend.title}</div>
      <p>${trend.summary}</p>
    `;
    grid.appendChild(card);
  });
}

function renderSpotlight() {
  const grid = document.getElementById("spotlight-grid");
  spotlight.forEach((item) => {
    const card = document.createElement("article");
    card.className = "spotlight-card";
    card.innerHTML = `
      <p class="label">${item.length}</p>
      <p class="title">${item.title}</p>
      <p class="summary">${item.copy}</p>
      <a class="text-link" href="#">Open playbook →</a>
    `;
    grid.appendChild(card);
  });
}

function renderHeroTags() {
  const tagPool = Array.from(new Set(posts.flatMap((p) => p.tags)));
  const tags = shuffle([...tagPool]).slice(0, 6);
  const heroTags = document.getElementById("hero-tags");
  heroTags.innerHTML = "";
  tags.forEach((tag) => {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = tag;
    heroTags.appendChild(pill);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function selectFeatured() {
  const fresh = posts.filter((p) => p.isNew);
  const pick = fresh[Math.floor(Math.random() * fresh.length)] || posts[0];
  const featured = document.getElementById("featured-title");
  featured.textContent = pick.title;
}

function init() {
  renderFilters();
  renderPosts();
  renderTrends();
  renderSpotlight();
  renderHeroTags();
  selectFeatured();

  document.getElementById("search").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderPosts();
  });

  document.getElementById("sort").addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderPosts();
  });

  document.getElementById("shuffle").addEventListener("click", () => {
    renderHeroTags();
    selectFeatured();
  });
}

window.addEventListener("DOMContentLoaded", init);
