import { state } from "./state.js";
import { showDisclaimer } from "../features/disclaimer.js";
import { showCards } from "../features/cards.js";

const content = document.getElementById("content");
const nav = document.querySelector(".topbar nav");

let overlay = null;

/* ---------- ROUTER CORE ---------- */

function navigate(id) {
  if (!state.disclaimerAccepted) {
    showDisclaimer(content, () => navigate(id));
    return;
  }
  loadPage(id);
}

function loadPage(id) {
  const page = state.pages.find(p => p.id === id);

  if (!page) {
    content.innerHTML = `<p>page not found</p>`;
    return;
  }

  if (!page.html) {
    content.innerHTML = `<p>page failed to load</p>`;
    return;
  }

  content.innerHTML = page.html;
  content.classList.toggle("home-page", id === "home");

  enableImageZoom();
  history.pushState({}, "", "#" + id);
}

/* ---------- UI ---------- */

function openOverlay() {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.className = "pages-overlay";

  const box = document.createElement("div");
  box.className = "pages-box";

  state.pages.forEach(p => {
    if (p.id === "home") return;

    const btn = document.createElement("button");
    btn.textContent = p.id;
    btn.onclick = () => {
      closeOverlay();
      navigate(p.id);
    };
    box.appendChild(btn);
  });

  overlay.onclick = e => {
    if (e.target === overlay) closeOverlay();
  };

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function closeOverlay() {
  overlay?.remove();
  overlay = null;
}

/* ---------- INIT ---------- */

function init() {
  // reorder pages so home is first
  const home = state.pages.find(p => p.id === "home");
  const others = state.pages.filter(p => p.id !== "home");
  state.pages = home ? [home, ...others] : state.pages;

  const profile = nav.querySelector(".profile-pic");
  nav.innerHTML = "";
  nav.appendChild(profile);

  const homeBtn = document.createElement("button");
  homeBtn.textContent = "home";
  homeBtn.onclick = () => navigate("home");
  nav.appendChild(homeBtn);

  const spacer = document.createElement("div");
  spacer.style.flex = "1";
  nav.appendChild(spacer);

  const pagesBtn = document.createElement("button");
  pagesBtn.textContent = "pages";
  pagesBtn.onclick = openOverlay;
  nav.appendChild(pagesBtn);

  const cardsBtn = document.createElement("button");
  cardsBtn.textContent = "cards";
  cardsBtn.onclick = () => {
    closeOverlay();
    showCards(content);
  };
  nav.appendChild(cardsBtn);
}

function start() {
  const id = location.hash.slice(1) || "home";
  navigate(id);
}

/* ---------- IMAGE ZOOM ---------- */

function enableImageZoom() {
  document.querySelectorAll("#content img").forEach(img => {
    img.style.cursor = "zoom-in";

    img.onclick = () => {
      const overlay = document.createElement("div");
      overlay.className = "image-overlay";

      const big = document.createElement("img");
      big.src = img.src;
      big.style.maxWidth = "90%";
      big.style.maxHeight = "90%";
      big.style.borderRadius = "12px";

      overlay.appendChild(big);
      overlay.onclick = () => overlay.remove();

      document.body.appendChild(overlay);
    };
  });
}

/* ---------- SAFE START ---------- */

function waitForPages() {
  if (state.pages.length && state.pages.every(p => "html" in p)) {
    init();
    start();
  } else {
    requestAnimationFrame(waitForPages);
  }
}

window.onpopstate = () => {
  const id = location.hash.slice(1) || "home";
  navigate(id);
};

waitForPages();