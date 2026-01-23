---
title: update1
date: 2026-01-23T01:16:57.377Z
---

# pxvault – recent changes log

this file documents **what i actually changed**, in order, starting from the first real version and ending at the current state.

this is not a README.
this is a brain dump.

---

## initial state

at the beginning, this site was:

- a single `index.html`
- hardcoded navigation
- raw html content
- no build step
- no structure
- just vibes

i quickly realized this would become unmaintainable the moment i added more than one page.

---

## moving content to markdown

the first real architectural change:

- all page content moved to markdown files
- markdown lives in `source/pages/`
- html became just a shell
- javascript handles rendering

why:
- faster to write
- less boilerplate
- easier to reorganize later

this introduced a **custom markdown parser**, intentionally minimal and fragile.

---

## ftree.js and dynamic pages

next step:

- wrote `ftree.js`
- runs locally with node.js
- scans `source/pages/`
- generates `index.json` with all markdown files
- no page list is hardcoded anywhere

result:
- adding a page = dropping a `.md` file
- navigation updates automatically
- no manual syncing

this is the core of the site now.

---

## router rewrite

initial router:
- buttons in topbar
- clicking replaced content
- hash-based navigation

problems:
- messy state
- growing complexity
- disclaimer logic got tangled

solution:
- split logic into modules
- router only handles navigation
- state lives in `state.js`

navigation now:
- home always loads first
- pages button opens a launcher overlay
- page switching never reloads the site

---

## loader system

big structural change:

- added `loader.js`
- site now has a boot process
- modules are loaded explicitly
- optional features can fail safely

loader does:
- logs what loads
- logs what fails
- preloads markdown pages
- hides loading screen only when ready

if something breaks:
- site still runs
- features just disable themselves

this made debugging **much easier**.

---

## disclaimer system

implemented a forced disclaimer:

- blocks all content
- shows glitch effect
- enforces a countdown
- cannot be skipped

features:
- "boss fight" timer
- accept button unlocks content
- state stored in memory only

this is intentionally annoying.

---

## chaos links feature

instead of redirecting away:

- disclaimer has a second option
- shows 250 real, unrelated links
- wikipedia, archive.org, fandoms, random nonsense
- grid layout
- fully client-side
- nothing is saved

controls:
- choose how many links to show
- regenerate
- emergency google button

this exists purely to waste time.

---

## game of life background

visual-only feature:

- canvas fills the screen
- conway’s game of life
- random initial state
- constant noise injection

purpose:
- looks alive
- hides layout imperfections
- gives terminal-wallpaper energy

safe to disable.
never critical.

---

## styling direction

design rules i followed:

- pixel fonts only
- gruvbox hard colors
- no rounded corners
- no shadows
- no animations unless glitchy
- buttons should feel like cli tools

everything should look:
- slightly broken
- intentional
- hostile to modern ui expectations

---

## current architecture summary

- static site
- no framework
- no bundler
- no backend
- markdown as content
- js as glue
- css as attitude

everything is replaceable.
nothing is sacred.

---

## next things i want to do

things that make sense next:

- markdown tabs or sections
- better code block styling
- syntax highlighting (manual or minimal)
- page metadata (date, tags)
- blog-style chronology
- search (probably terrible on purpose)
- keyboard navigation everywhere
- optional wasm experiments
- breaking this again

---

# fin
so this was my ted talk and be sure i did NOT say everything i wanted to say here. the rage i felt making this is nothing than all the rage the world has felt