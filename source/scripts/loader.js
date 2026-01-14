/*
file: loader.js
what this does:
- central bootloader for the entire site
- loads scripts in order
- logs what failed, what is optional, and what was skipped
- disables failing features instead of crashing
- preloads markdown pages
- hides the loading screen when done :)
(｀・ω・´)ゞ
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
  } catch (e) {
    if (optional) {
      fail(path + " (optional, disabled)");
      return false;
    } else {
      throw new Error(path + " failed hard");
    }
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
    // mandatory core
    await loadModule("./state.js");
    await loadModule("./markdown.js");
    await loadModule("./router.js");

    // optional features
    // deprecated too lmao await loadModule("./chaos.js", true);
    // deprecated await loadModule("./disclaimer.js", true);
    await loadModule("./matrix.js", true);

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

