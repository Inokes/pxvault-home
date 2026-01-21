/*
file: files.js
what this does:
- file explorer using index.json tree
- clicking a file shows raw contents
- no markdown parsing
- shows code/text as-is
- bottom-left download button
:)
*/

export function showFileExplorer(content, tree) {
  content.innerHTML = `<div class="file-explorer"></div>`;
  const root = content.querySelector(".file-explorer");

  function render(nodes, container) {
    nodes.forEach(n => {
      const item = document.createElement("div");
      item.className = "file-item";

      if (n.type === "dir") {
        const title = document.createElement("div");
        title.textContent = "📁 " + n.name;
        title.className = "dir";
        item.appendChild(title);

        const children = document.createElement("div");
        children.className = "children";
        children.style.display = "none";
        item.appendChild(children);

        title.onclick = () => {
          children.style.display =
            children.style.display === "none" ? "block" : "none";
        };

        render(n.children, children);
      } else {
        const file = document.createElement("div");
        file.textContent = "📄 " + n.name;
        file.className = "file";
        file.onclick = () => openFile(content, n.path);
        item.appendChild(file);
      }

      container.appendChild(item);
    });
  }

  render(tree, root);
}

async function openFile(content, path) {
  const res = await fetch(path);
  const text = await res.text();

  content.innerHTML = `
    <div class="file-viewer">
      <pre><code>${escapeHtml(text)}</code></pre>
      <a class="download-btn" href="${path}" download>
        download
      </a>
    </div>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}