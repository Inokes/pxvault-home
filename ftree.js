/*
file: ftree.js
what this does:
- scans the entire repository
- generates source/pages/index.json
- collects:
  - all markdown pages (for the router)
  - full file tree of the site
- ignores .git completely
this is run locally with node.js before deployment
＼(^^)／
*/

const fs = require("fs");
const path = require("path");

const root = __dirname;
const pagesBase = path.join(root, "source/pages");
const out = path.join(pagesBase, "index.json");

function walkPages(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let pages = [];

  for (const e of entries) {
    if (e.name === "index.json") continue;

    const full = path.join(dir, e.name);
    const rel = path.join(prefix, e.name);

    if (e.isDirectory()) {
      pages = pages.concat(walkPages(full, rel));
    } else if (e.isFile() && e.name.endsWith(".md")) {
      pages.push({
        id: rel.replace(/\.md$/, "").replace(/\\/g, "/"),
        file: rel.replace(/\\/g, "/")
      });
    }
  }

  return pages;
}

function walkTree(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let tree = [];

  for (const e of entries) {
    if (e.name === ".git") continue;

    const full = path.join(dir, e.name);
    const rel = path.join(prefix, e.name).replace(/\\/g, "/");

    if (e.isDirectory()) {
      tree.push({
        type: "dir",
        name: e.name,
        path: rel,
        children: walkTree(full, rel)
      });
    } else if (e.isFile()) {
      tree.push({
        type: "file",
        name: e.name,
        path: rel
      });
    }
  }

  return tree;
}

const index = {
  generated: new Date().toISOString(),
  pages: walkPages(pagesBase),
  tree: walkTree(root)
};

fs.writeFileSync(out, JSON.stringify(index, null, 2));
console.log("index.json generated");