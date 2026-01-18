const fs = require("fs")
const path = require("path")
const { marked } = require("./scripts/marked")

function walk(dir, base = dir, out = []) {
  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)

    if (stat.isDirectory()) {
      walk(full, base, out)
    } else {
      out.push(path.relative(base, full))
    }
  })
  return out
}

/* markdown → html */

const mdDir = path.join(process.cwd(), "md")
const htmlDir = path.join(process.cwd(), "html")

if (!fs.existsSync(htmlDir)) {
  fs.mkdirSync(htmlDir)
}

if (fs.existsSync(mdDir)) {
  fs.readdirSync(mdDir)
    .filter(f => f.endsWith(".md"))
    .forEach(file => {
      const md = fs.readFileSync(path.join(mdDir, file), "utf8")
      const html = marked(md)

      const out = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <main class="page active">
    ${html}
  </main>
</body>
</html>
`

      fs.writeFileSync(
        path.join(htmlDir, file.replace(".md", ".html")),
        out
      )
    })
}

/* tree */

const files = walk(process.cwd())

fs.writeFileSync(
  "index.json",
  JSON.stringify({ files }, null, 2)
)