import { load, notify } from "../utils/index.js"

const Selectors = {
  SOLD_RESULT_TABLE: ".sold-result-table",
  SEARCH: ".research-container input",
  TABLE_ROW: ".research-table-row",
  TABLE_ROW_ANCHOR: ".research-table-row__link-row-anchor",
}

const RefreshTargets = [
  ".search-input-panel__research-button",
  ".search-input-panel__dropdown",
  ".tabs__items",
]

const GroupedRefreshTargets = [".filter-menu-button__footer"]

const Colors = {
  NO_ANCHOR_BG_COLOR: "#EFEFEF",
}

// upgrade table

function upgradeSoldTable() {
  notify.trigger({
    content: "Table upgraded. Removed listings have a darker background color.",
  })

  const table = document.querySelector(Selectors.SOLD_RESULT_TABLE)
  const tableRows = table.querySelectorAll(Selectors.TABLE_ROW)

  for (const row of tableRows) {
    const anchor = row.querySelector(Selectors.TABLE_ROW_ANCHOR)

    if (!anchor) {
      row.style.backgroundColor = Colors.NO_ANCHOR_BG_COLOR
    }
  }
}

// checks if the table exists before upgrading it.

async function tryUpgradeSoldTable() {
  const table = await load(
    () => document.querySelector(Selectors.SOLD_RESULT_TABLE),
    "Results table took too long to load. Try again."
  )

  if (table) upgradeSoldTable()
}

// event listeners

function handleClick(event) {
  if (!event.target.disabled) tryUpgradeSoldTable()
}

function handleKeydown(event) {
  if (event.key === "Enter") tryUpgradeSoldTable()
}

// init the plugin

function init() {
  notify.trigger({
    content: "Plugin activated!",
  })

  // register click targets that refresh the table

  for (const sel of RefreshTargets) {
    sel.addEventListener("click", handleClick)
  }
  for (const groupSel of GroupedRefreshTargets) {
    document
      .querySelectorAll(groupSel)
      .forEach((sel) => sel.addEventListener("click", handleClick))
  }

  // handle enter of search input

  const searchBtn = document.querySelector(Selectors.SEARCH)
  searchBtn.addEventListener("keydown", handleKeydown)

  // Check if a table exists on load. If so, upgrade it.

  tryUpgradeSoldTable()
}

init()
