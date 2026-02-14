import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- find root ---------- */

function findRoot(start) {
  let dir = start;

  while (true) {
    const candidate = path.join(dir, "index.html");
    if (fs.existsSync(candidate)) return dir;

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error("project root not found");
}

const root = findRoot(__dirname);
const manifestPath = path.join(root, "source", "file-manifest.json");

/* ---------- ignore rules ---------- */

const IGNORE = [
  ".git",
  "node_modules",
  ".DS_Store"
];

function shouldIgnore(name) {
  return IGNORE.some(i => name.includes(i));
}

/* ---------- build tree ---------- */

function buildTree(dir) {
  const items = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (shouldIgnore(entry.name)) continue;

    const abs = path.join(dir, entry.name);
    const rel = path.relative(root, abs).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      items.push({
        type: "folder",
        name: entry.name,
        path: rel,
        children: buildTree(abs)
      });
    } else {
      items.push({
        type: "file",
        name: entry.name,
        path: rel
      });
    }
  }

  return items;
}

/* ---------- run ---------- */

const tree = buildTree(root);

fs.writeFileSync(
  manifestPath,
  JSON.stringify(tree, null, 2),
  "utf8"
);

console.log("file manifest generated");
