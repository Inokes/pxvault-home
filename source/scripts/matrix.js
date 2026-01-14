/*
file: matrix.js
subtle matrix background
styled to not fight the content
*/

const canvas = document.getElementById("life");
const ctx = canvas.getContext("2d");

let w, h, cols, drops;

const fontSize = 18;
const speed = 0.35; // menor = mais lento
const chars = "01abcdefghijklmnopqrstuvwxyz";

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  cols = Math.floor(w / fontSize);
  drops = Array(cols).fill(0);
}

function draw() {
  // fundo quase sólido, apaga agressivamente
  ctx.fillStyle = "rgba(29, 32, 33, 0.25)";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#3c3836"; // muted gruvbox
  ctx.font = fontSize + "px pixel, monospace";

  for (let i = 0; i < drops.length; i++) {
    if (Math.random() > speed) continue;

    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > h && Math.random() > 0.98) {
      drops[i] = 0;
    }

    drops[i]++;
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);

resize();
draw();