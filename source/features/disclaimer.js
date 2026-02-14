/*
file: disclaimer.js
blocks content behind a persistent disclaimer
with animation and optional chaos
*/

import { state } from "../core/state.js";
import { showChaosLinks } from "./chaos.js";

const COUNTDOWN_SECONDS = 5;
let timer = null;

export function disclaimerHtml(seconds) {
  return `
    <div class="disclaimer glitch">
      <h1 data-text="disclaimer">disclaimer</h1>
      <p>this website contains:</p>
      <ul>
        <li>profanity</li>
        <li>... that's all!</li>
        <li>unholy references to some worm fodder called nico</li>
        <li>hi</li>
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

export function showDisclaimer(content, onAccept) {
  let remaining = COUNTDOWN_SECONDS;
  content.innerHTML = disclaimerHtml(remaining);

  const yesBtn = document.getElementById("disclaimer-yes");
  const noBtn = document.getElementById("disclaimer-no");
  const countdownEl = content.querySelector(".countdown");
  const box = content.querySelector(".disclaimer");

  requestAnimationFrame(() => {
    box.classList.add("disclaimer-enter");
  });

  clearInterval(timer);

  timer = setInterval(() => {
    remaining--;
    countdownEl.textContent = `survive for ${remaining}s`;

    if (remaining <= 0) {
      clearInterval(timer);
      yesBtn.disabled = false;
      countdownEl.textContent = "boss defeated";
      box.classList.remove("glitch");
      box.classList.add("disclaimer-clear");
    }
  }, 1000);

  yesBtn.onclick = () => {
    if (yesBtn.disabled) return;

    state.disclaimerAccepted = true;
    localStorage.setItem("disclaimerAccepted", "true");

    onAccept();
  };

  noBtn.onclick = () => {
    showChaosLinks(content, 250);
  };
}