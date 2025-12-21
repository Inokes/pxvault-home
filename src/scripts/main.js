const themeToggle = document.getElementById("themeToggle")
const langToggle = document.getElementById("langToggle")
const root = document.documentElement

let theme = localStorage.getItem("theme") || "light"
let lang = localStorage.getItem("lang") || "pt"

const translations = {
  pt: {
    about_title: "sobre mim",
    about_text: "desenvolvedor focado em web, sistemas e experimentação.",
    github: "github",
    files: "files"
  },
  en: {
    about_title: "about me",
    about_text: "developer focused on web, systems and experimentation.",
    github: "github",
    files: "files"
  }
}

function applyLang() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = translations[lang][el.dataset.i18n]
  })
  langToggle.textContent = lang
}

themeToggle.onclick = () => {
  theme = theme === "dark" ? "light" : "dark"
  root.dataset.theme = theme
  localStorage.setItem("theme", theme)
}

langToggle.onclick = () => {
  lang = lang === "pt" ? "en" : "pt"
  localStorage.setItem("lang", lang)
  applyLang()
}

root.dataset.theme = theme
applyLang()

// partículas simples
const c = document.getElementById("particles")
const ctx = c.getContext("2d")
let w, h, p = []

function resize() {
  w = c.width = window.innerWidth
  h = c.height = window.innerHeight
}
window.onresize = resize
resize()

for (let i = 0; i < 80; i++)
  p.push({ x: Math.random()*w, y: Math.random()*h, v: Math.random()+0.3 })

function draw() {
  ctx.clearRect(0,0,w,h)
  p.forEach(pt => {
    pt.y += pt.v
    if (pt.y > h) pt.y = 0
    ctx.fillStyle = "rgba(150,150,150,0.3)"
    ctx.fillRect(pt.x, pt.y, 2, 2)
  })
  requestAnimationFrame(draw)
}
draw()