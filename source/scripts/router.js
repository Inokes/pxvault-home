const content = document.getElementById("content");
const nav = document.querySelector(".topbar nav");

let pages = [];
let disclaimerAccepted = false;
let countdownTimer = null;

const COUNTDOWN_SECONDS = 5;

const CHAOS_LINKS = [
  { name: "wikipedia – toast", url: "https://en.wikipedia.org/wiki/Toast" },
  { name: "wikipedia – time", url: "https://en.wikipedia.org/wiki/Time" },
  { name: "random wikipedia", url: "https://en.wikipedia.org/wiki/Special:Random" },
  { name: "archive.org", url: "https://archive.org" },
  { name: "internet archive random", url: "https://archive.org/details/random" },
  { name: "bolivia constitution", url: "https://www.constituteproject.org/constitution/Bolivia_2009" },
  { name: "gravity falls wiki", url: "https://gravityfalls.fandom.com/wiki/Gravity_Falls_Wiki" },
  { name: "homestuck", url: "https://www.homestuck.com" },
  { name: "cia reading room", url: "https://www.cia.gov/readingroom" },
  { name: "scp wiki", url: "https://scp-wiki.wikidot.com" },
  { name: "xkcd", url: "https://xkcd.com" },
  { name: "old reddit", url: "https://old.reddit.com" },
  { name: "useless web", url: "https://theuselessweb.com" },
  { name: "pointer pointer", url: "https://pointerpointer.com" },
  { name: "zoomquilt", url: "https://zoomquilt.org" }
];

// infla para passar de 250
while (CHAOS_LINKS.length < 300) {
  CHAOS_LINKS.push(...CHAOS_LINKS.map(l => ({
    name: l.name + " copy",
    url: l.url
  })));
}

function disclaimerHtml(seconds) {
  return `
  <div class="disclaimer glitch">
    <h1 data-text="disclaimer">disclaimer</h1>
    <p>this website contains:</p>
    <ul>
      <li>profanity</li>
      <li>toxicity</li>
      <li>brainwashing</li>
      <li>possible brain death caused by bad and unoptimized code</li>
    </ul>

    <p class="countdown">survive for ${seconds}s</p>

    <div class="disclaimer-actions">
      <button id="disclaimer-yes" disabled>yes, i understand</button>
      <button id="disclaimer-no">
        no, show me 250 different links for no reason
      </button>
    </div>
  </div>
  `;
}

function chaosHtml(count) {
  return `
    <div class="chaos">
      <div class="chaos-controls">
        <label>
          i want
          <input id="chaos-count" type="number" min="1" max="250" value="${count}">
          links
        </label>

        <button id="chaos-generate">regenerate</button>
        <button id="chaos-google">i can't search for google so take me there</button>
      </div>

      <div class="chaos-grid"></div>
    </div>
  `;
}

async function init() {
  const res = await fetch("source/pages/index.json");
  const data = await res.json();
  pages = data.pages;

  nav.innerHTML = "";

  pages.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = p.id.split("/").pop();
    btn.onclick = () => navigate(p.id, btn);
    nav.appendChild(btn);
  });

  const start = location.hash.slice(1) || pages[0].id;
  showDisclaimer(start, nav.children[0]);
}

function showDisclaimer(nextPageId, btn) {
  let remaining = COUNTDOWN_SECONDS;
  content.innerHTML = disclaimerHtml(remaining);

  const yesBtn = document.getElementById("disclaimer-yes");
  const noBtn = document.getElementById("disclaimer-no");
  const countdownEl = content.querySelector(".countdown");
  const box = content.querySelector(".disclaimer");

  clearInterval(countdownTimer);

  countdownTimer = setInterval(() => {
    remaining--;
    countdownEl.textContent = `survive for ${remaining}s`;

    if (remaining <= 0) {
      clearInterval(countdownTimer);
      yesBtn.disabled = false;
      countdownEl.textContent = "boss defeated";
      box.classList.remove("glitch");
    }
  }, 1000);

  yesBtn.onclick = () => {
    if (yesBtn.disabled) return;
    disclaimerAccepted = true;
    loadPage(nextPageId, btn);
  };

  noBtn.onclick = () => {
    showChaosLinks(250);
  };
}

function showChaosLinks(count) {
  content.innerHTML = chaosHtml(count);

  const grid = content.querySelector(".chaos-grid");
  const countInput = document.getElementById("chaos-count");
  const regenBtn = document.getElementById("chaos-generate");
  const googleBtn = document.getElementById("chaos-google");

  function render(n) {
    grid.innerHTML = "";
    const shuffled = [...CHAOS_LINKS]
      .sort(() => Math.random() - 0.5)
      .slice(0, n);

    shuffled.forEach(l => {
      const item = document.createElement("div");
      item.className = "chaos-item";
      item.innerHTML = `
        <div class="name">${l.name}</div>
        <a href="${l.url}" target="_blank">${l.url}</a>
      `;
      grid.appendChild(item);
    });
  }

  render(count);

  regenBtn.onclick = () => {
    render(parseInt(countInput.value, 10));
  };

  googleBtn.onclick = () => {
    window.location.href = "https://www.google.com";
  };
}

function navigate(id, btn) {
  if (!disclaimerAccepted) {
    showDisclaimer(id, btn);
    return;
  }
  loadPage(id, btn);
}

async function loadPage(id, btn) {
  const page = pages.find(p => p.id === id);
  if (!page) return;

  const md = await (await fetch(`source/pages/${page.file}`)).text();
  const html = parseMarkdown(md);

  content.innerHTML = html;

  [...nav.children].forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  history.pushState({}, "", "#" + id);
}

function parseMarkdown(md) {
  const lines = md.split("\n");
  let html = "";

  for (const line of lines) {
    if (line.startsWith("# ")) {
      html += `<h1>${line.slice(2)}</h1>`;
    } else if (line.trim()) {
      html += `<p>${line}</p>`;
    }
  }

  return html;
}

window.onpopstate = () => {
  const id = location.hash.slice(1);
  const idx = pages.findIndex(p => p.id === id);
  if (idx >= 0) {
    navigate(id, nav.children[idx]);
  }
};

init();