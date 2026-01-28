/*
file: particles.js
simple amoled-friendly particle background
adjusted to cold cyan palette
*/

const canvas = document.getElementById("life");
const ctx = canvas.getContext("2d");

let running = true;
let w, h;
let particles = [];

const COUNT = 120;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function create() {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.4 + 0.3,
    vy: Math.random() * 0.5 + 0.15,
    vx: Math.random() * 0.3 - 0.15,
    a: Math.random() * 0.35 + 0.15
  };
}

function init() {
  particles = Array.from({ length: COUNT }, create);
}

function draw() {
  if (!running) return;

  ctx.clearRect(0, 0, w, h);

  for (const p of particles) {
    ctx.fillStyle = `rgba(61, 220, 255, ${p.a})`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.y += p.vy;
    p.x += p.vx;

    if (p.y > h + 5) {
      p.y = -5;
      p.x = Math.random() * w;
    }

    if (p.x > w) p.x = 0;
    if (p.x < 0) p.x = w;
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  resize();
  init();
});

resize();
init();
draw();

document.addEventListener("visibilitychange", () => {
  running = document.visibilityState === "visible";
  if (running) draw();
});