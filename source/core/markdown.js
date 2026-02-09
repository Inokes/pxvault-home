export function extractFrontmatter(md) {
  if (!md.startsWith("---\n")) {
    return { meta: {}, body: md };
  }

  const end = md.indexOf("\n---", 3);
  if (end === -1) {
    return { meta: {}, body: md };
  }

  const raw = md.slice(4, end).trim();
  const body = md.slice(end + 4).trim();

  const meta = {};
  raw.split("\n").forEach(line => {
    const i = line.indexOf(":");
    if (i === -1) return;
    meta[line.slice(0, i).trim()] =
      line.slice(i + 1).trim();
  });

  return { meta, body };
}

export function parseMarkdown(md) {
  md = md.replace(/\r\n/g, "\n");

  // normaliza múltiplas linhas vazias
  md = md.replace(/\n{3,}/g, "\n\n");

  // escapa html
  md = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const code = [];
  md = md.replace(/```([\s\S]*?)```/g, (_, c) => {
    const k = `__CODE_${code.length}__`;
    const clean = c.replace(/^\n+|\n+$/g, "");
    code.push(`<pre><code>${clean}</code></pre>`);
    return k;
  });

  md = md.replace(/^###### (.*)$/gm, "<h6>$1</h6>");
  md = md.replace(/^##### (.*)$/gm, "<h5>$1</h5>");
  md = md.replace(/^#### (.*)$/gm, "<h4>$1</h4>");
  md = md.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  md = md.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  md = md.replace(/^# (.*)$/gm, "<h1>$1</h1>");

  md = md.replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>");
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<img src="$2" alt="$1">`);
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2">$1</a>`);

  md = md.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  md = md.replace(/\*(.+?)\*/g, "<em>$1</em>");
  md = md.replace(/`([^`]+)`/g, "<code>$1</code>");

  // blocos: evita <p> vazios e preserva quebras simples como <br>
  md = md
    .split(/\n{2,}/)
    .map(b => {
      if (!b) return "";
      if (b.trim().startsWith("<")) return b;
      const withBr = b.replace(/\n/g, "<br>");
      return `<p>${withBr}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  code.forEach((c, i) => {
    md = md.replace(`__CODE_${i}__`, c);
  });

  return md;
}