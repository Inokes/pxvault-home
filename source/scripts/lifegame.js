const canvas = document.getElementById("life");
const ctx = canvas.getContext("2d");
//controls size
const scale = 4; // low = lag
const chaos = 0.002; // lower = boring but not chaotic

let cols, rows, grid;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  cols = Math.floor(canvas.width / scale);
  rows = Math.floor(canvas.height / scale);

  grid = randomGrid();
}

function randomGrid() {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.5 ? 1 : 0)
  );
}

function draw() {
  ctx.fillStyle = "#1d2021";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#3c3836";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x]) {
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  grid = nextGeneration(grid);
  requestAnimationFrame(draw);
}

function nextGeneration(g) {
  const next = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      /* ruído contínuo */
      if (Math.random() < chaos) {
        next[y][x] = Math.random() > 0.5 ? 1 : 0;
        continue;
      }

      let neighbors = 0;

      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          if (!i && !j) continue;
          const cx = (x + i + cols) % cols;
          const cy = (y + j + rows) % rows;
          neighbors += g[cy][cx];
        }
      }

      if (g[y][x] && (neighbors === 2 || neighbors === 3)) {
        next[y][x] = 1;
      } else if (!g[y][x] && neighbors === 3) {
        next[y][x] = 1;
      }
    }
  }

  return next;
}

window.addEventListener("resize", resize);

resize();
draw();