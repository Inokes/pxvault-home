import { state } from "./state.js";
import { showDisclaimer } from "../features/disclaimer.js";
import { showCards } from "../features/cards.js";

const content = document.getElementById("content");
const nav = document.querySelector(".topbar nav");

let overlay = null;
let sortMode = "newest";
let filterText = "";

/* -------- helpers -------- */

function normalizeDate(d) {
  if (!d) return 0;
  if (d instanceof Date) return d.getTime();
  if (typeof d === "number") return d;
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
}

/* -------- navigation -------- */

function navigate(id) {
  if (!state.disclaimerAccepted) {
    showDisclaimer(content, () => navigate(id));
    return;
  }

  const page = state.pages.find(p => p.id === id);
  if (!page) {
    content.innerHTML = "<p>page not found</p>";
    return;
  }

  content.innerHTML = page.html;
  history.pushState({}, "", "#" + id);
}

/* -------- pages overlay -------- */

function openOverlay() {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.className = "pages-overlay";

  const box = document.createElement("div");
  box.className = "pages-box";

  const filter = document.createElement("input");
  filter.type = "text";
  filter.placeholder = "filter pages";
  filter.value = filterText;

  filter.oninput = () => {
    filterText = filter.value.toLowerCase();
    render();
  };

  const select = document.createElement("select");
  select.innerHTML = `
    <option value="newest">newest</option>
    <option value="oldest">oldest</option>
    <option value="title">title</option>
  `;
  select.value = sortMode;

  select.onchange = () => {
    sortMode = select.value;
    render();
  };

  box.append(filter, select);

  function render() {
    box.querySelectorAll("button.page-btn").forEach(b => b.remove());

    [...state.pages]
      .filter(p => p.id !== "home")
      .filter(p => {
        if (!filterText) return true;
        return (
          p.title?.toLowerCase().includes(filterText) ||
          p.id?.toLowerCase().includes(filterText)
        );
      })
      .sort((a, b) => {
        if (sortMode === "title") {
          return (a.title || "").localeCompare(b.title || "");
        }

        const da = normalizeDate(a.date);
        const db = normalizeDate(b.date);

        if (sortMode === "oldest") return da - db;
        return db - da; // newest
      })
      .forEach(p => {
        const btn = document.createElement("button");
        btn.className = "page-btn";

        const ts = normalizeDate(p.date);
        const dateStr = ts
          ? new Date(ts).toLocaleDateString("pt-BR")
          : "";

        btn.innerHTML = `
          <strong>${p.title}</strong>
          ${dateStr ? `<div class="date">${dateStr}</div>` : ""}
        `;

        btn.onclick = () => {
          closeOverlay();
          navigate(p.id);
        };

        box.appendChild(btn);
      });
  }

  render();

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

/* -------- init -------- */

function init() {
  const profile = nav.querySelector(".profile-pic");
  nav.innerHTML = "";
  nav.appendChild(profile);

  const home = document.createElement("button");
  home.textContent = "home";
  home.onclick = () => navigate("home");

  const pages = document.createElement("button");
  pages.textContent = "pages";
  pages.onclick = openOverlay;

  const cards = document.createElement("button");
  cards.textContent = "cards";
  cards.onclick = () => showCards(content);

  nav.append(home, pages, cards);
}

function start() {
  init();
  navigate(location.hash.slice(1) || "home");
}

window.onpopstate = () => {
  navigate(location.hash.slice(1) || "home");
};

const wait = () => {
  if (state.pages?.length) start();
  else requestAnimationFrame(wait);
};

wait();