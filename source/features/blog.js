/*
file: blog.js
markdown blog feed renderer
*/

import { loadMarkdown } from "../utils/markdown.js";

export async function showBlog(content) {
  const posts = await loadMarkdown("/content/pages");

  const parsed = posts
    .map(p => parsePost(p))
    .filter(Boolean)
    .sort((a, b) => b.date - a.date);

  content.innerHTML = `
    <section class="blog-feed">
      ${parsed.map(renderPost).join("")}
    </section>
  `;
}

function parsePost(file) {
  const match = file.raw.match(/date:\s*(.+)/);
  if (!match) return null;

  const date = new Date(match[1]);
  const body = file.raw.split("---").slice(2).join("---").trim();
  const lines = body.split("\n").map(l => l.trim());

  const firstLine = lines.find(
    l => l && !l.startsWith("#")
  );

  return {
    path: file.path,
    date,
    preview: firstLine || "",
    isLatest: false
  };
}

function renderPost(post, index) {
  const latest = index === 0;

  return `
    <article class="blog-post ${latest ? "latest" : ""}">
      ${latest ? `<span class="latest-tag">latest post</span>` : ""}
      <time>${post.date.toISOString().slice(0, 10)}</time>
      <code>${post.path}</code>
      <p>${post.preview}</p>
    </article>
  `;
}

