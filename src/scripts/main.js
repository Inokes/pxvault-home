const canvas = document.getElementById("life");
const ctx = canvas.getContext("2d");

let w, h, cols, rows;
const cellSize = 6;
let grid = [];
let next = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  cols = Math.floor(w / cellSize);
  rows = Math.floor(h / cellSize);
  init();
}

window.addEventListener("resize", resize);

function init() {
  grid = new Array(cols).fill(0).map(() =>
    new Array(rows).fill(0).map(() => Math.random() > 0.85 ? 1 : 0)
  );
  next = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
}

function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const col = (x + i + cols) % cols;
      const row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  return sum;
}

function update() {
  ctx.clearRect(0, 0, w, h);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const state = grid[x][y];
      const neighbors = countNeighbors(x, y);

      if (state === 0 && neighbors === 3) next[x][y] = 1;
      else if (state === 1 && (neighbors < 2 || neighbors > 3)) next[x][y] = 0;
      else next[x][y] = state;

      if (next[x][y]) {
        ctx.fillStyle = "rgba(120,180,255,0.8)";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  const temp = grid;
  grid = next;
  next = temp;

  requestAnimationFrame(update);
}

resize();
update();