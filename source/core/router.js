import { state } from "./state.js";
import { showDisclaimer } from "../features/disclaimer.js";
import { showCards } from "../features/cards.js";

const content = document.getElementById("content");
const nav = document.querySelector(".topbar nav");

/* -------- helpers -------- */

function normalizeDate(d) {
  if (!d) return 0;
  if (d instanceof Date) return d.getTime();
  if (typeof d === "number") return d;
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
}

function getFirstTextLine(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;

  const walker = document.createTreeWalker(
    tmp,
    NodeFilter.SHOW_TEXT,
    null
  );

  while (walker.nextNode()) {
    const t = walker.currentNode.textContent.trim();
    if (t) return t;
  }

  return "";
}

/* -------- navigation -------- */

function navigate(id) {
  if (!state.disclaimerAccepted) {
    showDisclaimer(content, () => navigate(id));
    return;
  }

  if (id === "blog") {
    renderBlog();
    history.pushState({}, "", "#blog");
    return;
  }

  const page = state.pages.find(p => p.id === id);
  if (!page) {
    content.innerHTML = "<p>page not found</p>";
    return;
  }

  content.innerHTML = page.html;
  history.pushState({}, "", "#" + id);
}

/* -------- blog feed -------- */

function renderBlog() {
  const posts = [...state.pages]
    .filter(p => p.id !== "home")
    .sort((a, b) => normalizeDate(b.date) - normalizeDate(a.date));

  content.innerHTML = `
    <section class="blog-feed">
      ${posts.map(renderPost).join("")}
    </section>
  `;

  content.querySelectorAll("[data-post]").forEach(el => {
    el.onclick = () => navigate(el.dataset.post);
  });
}

function renderPost(p, index) {
  const ts = normalizeDate(p.date);
  const dateStr = ts
    ? new Date(ts).toLocaleDateString("pt-br")
    : "";

  const preview = getFirstTextLine(p.html);

  return `
    <article
      class="blog-post ${index === 0 ? "latest" : ""}"
      data-post="${p.id}"
    >
      ${index === 0 ? `<span class="latest-tag">latest post</span>` : ""}
      <div class="meta">
        <strong>${p.title || p.id}</strong>
        ${dateStr ? `<time>${dateStr}</time>` : ""}
      </div>
      <p class="preview">${preview}</p>
      <code>#${p.id}</code>
    </article>
  `;
}

/* -------- init -------- */

function init() {
  const profile = nav.querySelector(".profile-pic");
  nav.innerHTML = "";
  nav.appendChild(profile);

  const home = document.createElement("button");
  home.textContent = "home";
  home.onclick = () => navigate("home");

  const blog = document.createElement("button");
  blog.textContent = "blog";
  blog.onclick = () => navigate("blog");

  const cards = document.createElement("button");
  cards.textContent = "cards";
  cards.onclick = () => showCards(content);

  nav.append(home, blog, cards);
}

function start() {
  init();
  navigate(location.hash.slice(1) || "home");
}

window.onpopstate = () => {
  navigate(location.hash.slice(1) || "home");
};

const wait = () => {
  if (state.pages?.length) start();
  else requestAnimationFrame(wait);
};

wait();