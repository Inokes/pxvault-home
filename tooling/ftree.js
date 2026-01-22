import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* raiz do projeto */
const root = path.resolve(__dirname, "..");

/* diretório de páginas */
const pagesDir = path.join(root, "source", "pages");

/* arquivo de saída */
const outFile = path.join(pagesDir, "index.json");

function walk(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const abs = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(abs, rel));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push({
        id: rel.replace(/\.md$/, "").replace(/\\/g, "/"),
        file: rel.replace(/\\/g, "/")
      });
    }
  }

  return files;
}

function buildIndex() {
  if (!fs.existsSync(pagesDir)) {
    console.error("source/pages não existe:", pagesDir);
    process.exit(1);
  }

  const pages = walk(pagesDir).sort((a, b) =>
  a.id.localeCompare(b.id)
);

  fs.writeFileSync(
    outFile,
    JSON.stringify({ pages }, null, 2),
    "utf-8"
  );

  console.log("index.json gerado com", pages.length, "páginas");
}

buildIndex();