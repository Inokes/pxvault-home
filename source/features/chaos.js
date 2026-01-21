/*
file: chaos.js
what this does:
- generates absurd amounts of real random links
- purely for psychological damage
- fully optional feature
recommended to keep for maximum chaos :)
(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
*/

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

while (CHAOS_LINKS.length < 300) {
  CHAOS_LINKS.push(...CHAOS_LINKS.map(l => ({
    name: l.name + " copy",
    url: l.url
  })));
}

export function chaosHtml(count) {
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

export function showChaosLinks(content, count) {
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

  regenBtn.onclick = () => render(parseInt(countInput.value, 10));
  googleBtn.onclick = () => window.location.href = "https://www.google.com";
}

