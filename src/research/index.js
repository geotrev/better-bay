import { load, notify } from "../utils/index.js"

const Selectors = {
  soldResultTable: ".sold-result-table",
  searchSubmit: ".search-input-panel__research-button",
  search: ".research-container input",
}

function upgradeSoldTable() {
  notify.trigger({
    content:
      "Table upgraded. To exclude items, click checkboxes and press Alt+Shift+E.",
  })
}

async function tryUpgradeSoldTable() {
  const table = await load(
    () => document.querySelector(Selectors.soldResultTable),
    "Results table took too long to load. Try again."
  )

  if (table) {
    upgradeSoldTable()
  }
}

function handleClick(event) {
  if (!event.target.disabled) tryUpgradeSoldTable()
}

function handleKeydown(event) {
  if (event.key === "Enter") tryUpgradeSoldTable()
}

async function init() {
  notify.trigger({
    content: "Plugin activated!",
  })

  // handle click of main search button
  const triggerBtn = document.querySelector(Selectors.searchSubmit)
  triggerBtn.addEventListener("click", handleClick)

  // handle enter of search input
  const searchBtn = document.querySelector(Selectors.search)
  searchBtn.addEventListener("keydown", handleKeydown)

  // Check if a table existed on load. If so, upgrade it.
  const table = await load(
    () => document.querySelector(Selectors.soldResultTable),
    "Search to get started."
  )

  if (table) tryUpgradeSoldTable()
}

init()
