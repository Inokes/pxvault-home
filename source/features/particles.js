/*
file: particles.js
simple amoled-friendly particle background
*/

const canvas = document.getElementById("life");
const ctx = canvas.getContext("2d");

let running = true;
let w, h;
let particles = [];

const COUNT = 140;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function create() {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6 + 0.4,
    vy: Math.random() * 0.6 + 0.2,
    vx: Math.random() * 0.4 - 0.2
  };
}

function init() {
  particles = Array.from({ length: COUNT }, create);
}

function draw() {
  if (!running) return;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(0, 255, 156, 0.45)";

  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.y += p.vy;
    p.x += p.vx;

    if (p.y > h) {
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