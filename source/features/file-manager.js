export async function showFileManager(content) {
  const res = await fetch("source/file-manifest.json");
  const tree = await res.json();

  content.innerHTML = `
    <div class="file-manager">
      <div class="file-tree"></div>
      <div class="file-viewer">
        <div class="file-meta"></div>
        <pre class="file-content"></pre>
      </div>
    </div>
  `;

  const treeEl = content.querySelector(".file-tree");
  const viewer = content.querySelector(".file-content");
  const meta = content.querySelector(".file-meta");

  function renderNode(node, container) {
    const item = document.createElement("div");
    item.className = "file-node";

    if (node.type === "folder") {
      item.innerHTML = `<div class="folder">${node.name}</div>`;
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "children hidden";

      item.querySelector(".folder").onclick = () => {
        childrenContainer.classList.toggle("hidden");
      };

      node.children.forEach(child =>
        renderNode(child, childrenContainer)
      );

      item.appendChild(childrenContainer);
    } else {
      item.innerHTML = `<div class="file">${node.name}</div>`;

      item.onclick = async () => {
        try {
          const res = await fetch(node.path);
          const text = await res.text();

          viewer.textContent = text;
          meta.innerHTML = `
            <strong>${node.path}</strong>
            <button id="download-btn">download</button>
          `;

          document.getElementById("download-btn").onclick = () => {
            const blob = new Blob([text]);
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = node.name;
            a.click();
          };
        } catch {
          viewer.textContent = "unable to load file";
        }
      };
    }

    container.appendChild(item);
  }

  tree.forEach(node => renderNode(node, treeEl));
}
