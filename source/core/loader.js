/*
central bootloader
*/

import { state } from "./state.js";
import { parseMarkdown } from "./markdown.js";

async function loadModule(path, optional = false) {
  try {
    return await import(path);
  } catch (e) {
    if (optional) return null;
    throw e;
  }
}

async function preloadPages() {
  const res = await fetch("source/pages/index.json");
  const data = await res.json();

  state.pages = await Promise.all(
    data.pages.map(async p => {
      const md = await (await fetch("source/pages/" + p.file)).text();
      return {
        ...p,
        html: parseMarkdown(md)
      };
    })
  );
}

(async function boot() {
  try {
    await loadModule("./markdown.js");
    await loadModule("./router.js");
    await loadModule("../features/cards.js");

    state.features.disclaimer =
      await loadModule("../features/disclaimer.js", true);
    state.features.particles =
      await loadModule("../features/particles.js", true);
    state.features.chaos =
      await loadModule("../features/chaos.js", true);
    state.features.files =
      await loadModule("../features/files.js", true);

    await preloadPages();
  } finally {
    document.getElementById("loader-screen")?.remove();
  }
})();