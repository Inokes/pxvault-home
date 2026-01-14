/*
file: disclaimer.js
what this does:
- blocks content behind a disclaimer
- enforces countdown + glitch effect
- optionally opens chaos link hell
if this fails, content loads immediately :)
ಠ‿ಠ
*/

import { state } from "./state.js";
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

export function showDisclaimer(content, onAccept) {
  let remaining = COUNTDOWN_SECONDS;
  content.innerHTML = disclaimerHtml(remaining);

  const yesBtn = document.getElementById("disclaimer-yes");
  const noBtn = document.getElementById("disclaimer-no");
  const countdownEl = content.querySelector(".countdown");
  const box = content.querySelector(".disclaimer");

  clearInterval(timer);

  timer = setInterval(() => {
    remaining--;
    countdownEl.textContent = `survive for ${remaining}s`;

    if (remaining <= 0) {
      clearInterval(timer);
      yesBtn.disabled = false;
      countdownEl.textContent = "boss defeated";
      box.classList.remove("glitch");
    }
  }, 1000);

  yesBtn.onclick = () => {
    if (yesBtn.disabled) return;
    state.disclaimerAccepted = true;
    onAccept();
  };

  noBtn.onclick = () => {
    showChaosLinks(content, 250);
  };
}

