import { state } from "./state.js";
import { parseMarkdown, extractFrontmatter } from "./markdown.js";

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

  const all = await Promise.all(
    data.pages.map(async p => {
      const raw = await (await fetch("source/pages/" + p.file)).text();
      const { meta, body } = extractFrontmatter(raw);

      return {
        ...p,
        title: meta.title || p.id,
        date: meta.date ? new Date(meta.date) : null,
        type: meta.type || null,
        meta,
        html: parseMarkdown(body)
      };
    })
  );

  /* ---------- hard separation ---------- */

  state.facts = all.filter(p => p.type === "fact");
  state.pages = all.filter(p => p.type !== "fact");
}

/* ---------- continue screen + background music ---------- */

function showContinueScreen() {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.id = "continue-screen";
    overlay.innerHTML = `
      <div class="continue-text">continue?</div>
    `;

    // background music
    const audio = new Audio("source/assets/audio/FluorescentAdolescent.mp3");
    audio.loop = true;
    audio.volume = 0.18;

    overlay.addEventListener("click", async () => {
      try {
        await audio.play();
      } catch (e) {
        // ignore autoplay/play errors silently
      }

      overlay.remove();
      resolve();
    });

    document.body.appendChild(overlay);
  });
}

(async function boot() {
  try {
    await loadModule("./router.js");
    await loadModule("../features/cards.js");

    state.features.disclaimer =
      await loadModule("../features/disclaimer.js", true);
    state.features.particles =
      await loadModule("../features/particles.js", true);

    await preloadPages();
  } finally {
    document.getElementById("loader-screen")?.remove();

    // tela intermediária antes do disclaimer + inicia musica
    await showContinueScreen();
  }
})();