/*
file: latestPost.js
shows most recent blog post (safe for mobile, no devtools)
*/

import { state } from "../core/state.js";

let panel = null;

function getLatestPost() {
  return [...state.pages]
    .filter(p => p.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

function navigateTo(id) {
  location.hash = "#" + id;
}

export function showLatestPost() {
  if (panel) return;

  // espera silenciosamente até os posts existirem
  if (!state.pages || state.pages.length === 0) {
    setTimeout(showLatestPost, 200);
    return;
  }

  const post = getLatestPost();
  if (!post) return;

  panel = document.createElement("div");
  panel.id = "latest-post-panel";

  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString("pt-BR")
    : "";

  panel.innerHTML = `
    <div class="latest-label">latest post</div>
    <div class="latest-title">${post.title}</div>
    <div class="latest-date">${dateStr}</div>
  `;

  panel.addEventListener("click", () => navigateTo(post.id));

  document.body.appendChild(panel);

  requestAnimationFrame(() => {
    panel.classList.add("visible");
  });
}