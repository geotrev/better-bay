import { load, notify, createEventTargetObserver } from "../utils/index.js"
import {
  Selectors,
  RefreshTargets,
  GroupedRefreshTargets,
  Colors,
} from "./enums.js"

const { subscribeEventTargets } = createEventTargetObserver()

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

async function init() {
  notify.trigger({
    content: "Plugin activated!",
  })

  // wrap event listeners with mutationobserver to auto-replace
  // handler when they're removed via filtering etc.

  // handle enter of search input

  const searchBtn = document.querySelector(Selectors.SEARCH)
  searchBtn.addEventListener("keydown", handleKeydown)

  // register click targets that refresh the table

  for (const selector of RefreshTargets) {
    const element = await load(() => document.querySelector(selector))

    if (element) {
      subscribeEventTargets({
        elements: [element],
        selector,
        type: "click",
        handler: handleClick,
      })
    }
  }

  for (const selector of GroupedRefreshTargets) {
    const elements = await load(() => {
      const els = Array.from(document.querySelectorAll(selector))
      return els.length ? els : null
    })

    if (elements) {
      subscribeEventTargets({
        elements,
        selector,
        type: "click",
        handler: handleClick,
      })
    }
  }

  // Check if a table exists on load. If so, upgrade it.

  tryUpgradeSoldTable()
}

init()
