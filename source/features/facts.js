/*
file: facts.js
random fun fact renderer
*/

import { state } from "../core/state.js";

const animations = [
  "fact-slide",
  "fact-scale",
  "fact-fade"
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function showFacts(content) {
  const facts = state.pages.filter(p => p.type === "fact");

  if (!facts.length) {
    content.innerHTML = "<p>no facts available</p>";
    return;
  }

  content.innerHTML = `
    <section class="fact-box">
      <div class="fact-text"></div>
      <button class="fact-next">another fact</button>
      <div class="fact-credit">idea by sano</div>
    </section>
  `;

  const text = content.querySelector(".fact-text");
  const next = content.querySelector(".fact-next");

  function render() {
    const fact = pick(facts);
    const anim = pick(animations);

    text.className = "fact-text " + anim;
    text.innerHTML = fact.html;
  }

  next.onclick = render;
  render();
}

