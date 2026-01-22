/*
file: markdown.js
minimal markdown parser
still dumb, just less self-destructive
*/

export function parseMarkdown(md) {
  md = md.replace(/\r\n/g, "\n");

  // escape html
  md = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // ---- protect code blocks ----
  const codeBlocks = [];
  md = md.replace(/```([\s\S]*?)```/g, (_, code) => {
    const key = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code>${code}</code></pre>`);
    return key;
  });

  // horizontal rule
  md = md.replace(/^---$/gm, "<hr>");

  // headings
  md = md.replace(/^###### (.*)$/gm, "<h6>$1</h6>");
  md = md.replace(/^##### (.*)$/gm, "<h5>$1</h5>");
  md = md.replace(/^#### (.*)$/gm, "<h4>$1</h4>");
  md = md.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  md = md.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  md = md.replace(/^# (.*)$/gm, "<h1>$1</h1>");

  // blockquote
  md = md.replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>");

  // images
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<img src="$2" alt="$1">`);

  // links
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank">$1</a>`);

  // bold + italic
  md = md.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");

  // bold
  md = md.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // italic (avoid list markers)
  md = md.replace(/(^|[^\*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>");

  // inline code
  md = md.replace(/`([^`]+)`/g, "<code>$1</code>");

  // unordered lists
  md = md.replace(
    /(?:^|\n)([-*] .*(?:\n[-*] .*)*)/g,
    block => {
      const items = block
        .trim()
        .split("\n")
        .map(l => `<li>${l.slice(2)}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }
  );

  // ordered lists
  md = md.replace(
    /(?:^|\n)((?:\d+\. .*(?:\n\d+\. .*)*))/g,
    block => {
      const items = block
        .trim()
        .split("\n")
        .map(l => `<li>${l.replace(/^\d+\. /, "")}</li>`)
        .join("");
      return `<ol>${items}</ol>`;
    }
  );

  // paragraphs (more tolerant)
  md = md
    .split("\n\n")
    .map(block => {
      if (block.trim().startsWith("<")) return block;
      if (!block.trim()) return "";
      return `<p>${block.trim()}</p>`;
    })
    .join("\n");

  // ---- restore code blocks ----
  codeBlocks.forEach((html, i) => {
    md = md.replace(`__CODE_BLOCK_${i}__`, html);
  });

  return md;
}