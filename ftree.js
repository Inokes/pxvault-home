const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "source/pages");
const out = path.join(base, "index.json");

function walk(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let pages = [];

  for (const e of entries) {
    if (e.name === "index.json") continue;

    const full = path.join(dir, e.name);
    const rel = path.join(prefix, e.name);

    if (e.isDirectory()) {
      pages = pages.concat(walk(full, rel));
    } else if (e.isFile() && e.name.endsWith(".md")) {
      pages.push({
        id: rel.replace(/\.md$/, "").replace(/\\/g, "/"),
        file: rel.replace(/\\/g, "/")
      });
    }
  }

  return pages;
}

const index = {
  generated: new Date().toISOString(),
  pages: walk(base)
};

fs.writeFileSync(out, JSON.stringify(index, null, 2));
console.log("index.json gerado");