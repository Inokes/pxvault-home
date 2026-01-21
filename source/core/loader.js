/*
central bootloader
*/

const logEl = document.getElementById("loader-log");
const loaderScreen = document.getElementById("loader-screen");

function log(msg) {
  logEl.textContent += msg + "\n";
}

function fail(msg) {
  log("[fail] " + msg);
}

function ok(msg) {
  log("[ok] " + msg);
}

async function loadModule(path, optional = false) {
  try {
    await import(path);
    ok(path);
    return true;
  } catch {
    if (optional) {
      fail(path + " (optional, disabled)");
      return false;
    }
    throw new Error(path + " failed hard");
  }
}

async function preloadPages() {
  try {
    const res = await fetch("source/pages/index.json");
    const data = await res.json();

    await Promise.all(
      data.pages.map(p =>
        fetch("source/pages/" + p.file).catch(() => null)
      )
    );

    ok("markdown pages preloaded");
  } catch {
    fail("page preload failed");
  }
}

(async function boot() {
  log("booting system...");
  log("");

  try {
    await loadModule("./state.js");
    await loadModule("./markdown.js");
    await loadModule("./router.js");

    await loadModule("../features/cards.js", true);
    await loadModule("../features/disclaimer.js", true);
    await loadModule("../features/particles.js", true);
    await loadModule("../features/chaos.js", true);
    await loadModule("../features/files.js", true);

    await preloadPages();

    ok("boot complete");
  } catch (e) {
    fail(e.message);
  } finally {
    setTimeout(() => {
      loaderScreen.style.opacity = "0";
      loaderScreen.style.pointerEvents = "none";
    }, 500);
  }
})();