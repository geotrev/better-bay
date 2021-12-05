import { load, notify } from "../utils/index.js"

const Selectors = {
  soldResultTable: ".sold-result-table",
  searchSubmit: ".search-input-panel__research-button",
  search: ".research-container input",
  tableRow: ".research-table-row",
  tableRowAnchor: ".research-table-row__link-row-anchor",
}

const Colors = {
  noRowAnchorBackgroundColor: "#EFEFEF",
}

function upgradeSoldTable() {
  notify.trigger({
    content: "Table upgraded. Removed listings have a darker background color.",
  })

  const table = document.querySelector(Selectors.soldResultTable)
  const tableRows = table.querySelectorAll(Selectors.tableRow)

  for (const row of tableRows) {
    const anchor = row.querySelector(Selectors.tableRowAnchor)
    if (!anchor) row.style.backgroundColor = Colors.noRowAnchorBackgroundColor
  }
}

async function tryUpgradeSoldTable() {
  const table = await load(
    () => document.querySelector(Selectors.soldResultTable),
    "Results table took too long to load. Try again."
  )

  if (table) upgradeSoldTable()
}

function handleClick(event) {
  if (!event.target.disabled) tryUpgradeSoldTable()
}

function handleKeydown(event) {
  if (event.key === "Enter") tryUpgradeSoldTable()
}

function init() {
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
  tryUpgradeSoldTable()
}

init()
