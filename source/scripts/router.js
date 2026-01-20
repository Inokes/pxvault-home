import { state } from "./state.js";
import { parseMarkdown } from "./markdown.js";
import { showDisclaimer } from "./disclaimer.js";

const content = document.getElementById("content");
const nav = document.querySelector(".topbar nav");

let overlay = null;

async function init() {
  const res = await fetch("source/pages/index.json");
  const data = await res.json();

  const home = data.pages.find(p => p.id === "home");
  const others = data.pages.filter(p => p.id !== "home");
  state.pages = home ? [home, ...others] : data.pages;

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

  navigate("home");
}

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
  if (!overlay) return;
  overlay.remove();
  overlay = null;
}

function navigate(id) {
  if (!state.disclaimerAccepted) {
    showDisclaimer(content, () => loadPage(id));
    return;
  }
  loadPage(id);
}

async function loadPage(id) {
  const page = state.pages.find(p => p.id === id);
  if (!page) return;

  const md = await (await fetch(`source/pages/${page.file}`)).text();
  content.innerHTML = parseMarkdown(md);

  content.classList.toggle("home-page", id === "home");

  enableImageZoom();
  history.pushState({}, "", "#" + id);
}

window.onpopstate = () => {
  const id = location.hash.slice(1) || "home";
  navigate(id);
};

function enableImageZoom() {
  document.querySelectorAll("img").forEach(img => {
    img.style.cursor = "zoom-in";

    img.onclick = () => {
      const overlay = document.createElement("div");
      overlay.className = "image-overlay";

      const big = document.createElement("img");
      big.src = img.src;
      big.style.maxWidth = "90%";
      big.style.maxHeight = "90%";
      big.style.borderRadius = "12px";
      big.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
      big.style.objectFit = "contain";

      overlay.appendChild(big);
      overlay.onclick = () => overlay.remove();

      document.body.appendChild(overlay);
    };
  });
}

init();