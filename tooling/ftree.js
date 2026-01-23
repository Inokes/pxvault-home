import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ---------- resolve script location ---------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- find project root ---------- */

function findRoot(start) {
  let dir = start;

  while (true) {
    if (fs.existsSync(path.join(dir, "index.html"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error("project root not found");
}

const root = findRoot(__dirname);

/* ---------- paths ---------- */

const pagesDir = path.join(root, "source", "pages");
const indexFile = path.join(pagesDir, "index.json");

/* ---------- frontmatter ---------- */

function hasFrontmatter(text) {
  return text.startsWith("---\n");
}

function makeFrontmatter(title, date) {
  return `---
title: ${title}
date: ${date}
---

`;
}

/* ---------- walker ---------- */

function walk(dir, base = "") {
  const out = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;

    const abs = path.join(dir, entry.name);
    const rel = path.join(base, entry.name).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      out.push(...walk(abs, rel));
      continue;
    }

    if (!entry.name.endsWith(".md")) continue;

    const stat = fs.statSync(abs);
    let text = fs.readFileSync(abs, "utf8");

    if (!hasFrontmatter(text)) {
      const title = path.basename(entry.name, ".md");
      const date = stat.mtime.toISOString();
      text = makeFrontmatter(title, date) + text;
      fs.writeFileSync(abs, text, "utf8");
    }

    out.push({
      id: rel.replace(/\.md$/, ""),
      file: rel
    });
  }

  return out;
}

/* ---------- run ---------- */

if (!fs.existsSync(pagesDir)) {
  throw new Error(`missing directory: ${pagesDir}`);
}

const pages = walk(pagesDir).sort((a, b) =>
  a.id.localeCompare(b.id)
);

fs.writeFileSync(
  indexFile,
  JSON.stringify({ pages }, null, 2),
  "utf8"
);

console.log(`ftree: indexed ${pages.length} markdown files`);