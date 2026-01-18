const pages = document.querySelectorAll(".page")
const buttons = document.querySelectorAll(".sidebar button")
const toggle = document.getElementById("theme-toggle")
const root = document.documentElement

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1]
}

const savedTheme = getCookie("theme")
if (savedTheme === "dark" || savedTheme === "light") {
  root.setAttribute("data-theme", savedTheme)
} else {
  root.setAttribute(
    "data-theme",
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  )
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.page

    buttons.forEach(b => b.classList.remove("active"))
    pages.forEach(p => p.classList.remove("active"))

    button.classList.add("active")
    document.getElementById(target)?.classList.add("active")
  })
})

toggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme")
  const next = current === "dark" ? "light" : "dark"
  root.setAttribute("data-theme", next)
  setCookie("theme", next)
})

/* the amount of times i do this file fetching bullshit is gigantic */

fetch("/index.json")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("pages-list")

    data.files
      .filter(f => f.startsWith("html/") && f.endsWith(".html"))
      .forEach(file => {
        const li = document.createElement("li")
        const a = document.createElement("a")

        a.href = "/" + file
        a.textContent = file
          .replace("html/", "")
          .replace(".html", "")
          .replace(/-/g, " ")

        li.appendChild(a)
        list.appendChild(li)
      })
  })