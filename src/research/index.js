import { load, notify } from "../utils/index.js"
import {
  StaticTargetSelectors,
  DynamicTargetSelectors,
  GroupedDynamicTargetSelectors,
  Colors,
} from "./enums.js"

let dynamicTargets = []

function upgradeSoldTable() {
  notify.trigger({
    content: "Table upgraded. Removed listings have a darker background color.",
  })

  const table = document.querySelector(StaticTargetSelectors.SOLD_RESULT_TABLE)
  const tableRows = table.querySelectorAll(StaticTargetSelectors.TABLE_ROW)

  for (const row of tableRows) {
    const anchor = row.querySelector(StaticTargetSelectors.TABLE_ROW_ANCHOR)

    if (!anchor) {
      row.style.backgroundColor = Colors.NO_ANCHOR_BG_COLOR
    }
  }
}

// checks if the table exists before upgrading it.

async function tryUpgradeSoldTable() {
  const table = await load(
    () => document.querySelector(StaticTargetSelectors.SOLD_RESULT_TABLE),
    "Results table took too long to load. Try again."
  )

  if (table) upgradeSoldTable()
}

// event listeners

/**
 * If the target isn't disabled, wait for a new
 * table state and upgrade the table + filter UI
 */
function handleClick(event) {
  if (!event.target.disabled) {
    setTimeout(async () => {
      await tryUpgradeSoldTable()

      dynamicTargets.forEach((target) =>
        target.removeEventListener("click", handleClick)
      )
      dynamicTargets = []

      addDynamicTargetListeners()
    }, 2000)
  }
}

function handleKeydown(event) {
  if (event.key === "Enter") tryUpgradeSoldTable()
}

async function addDynamicTargetListeners() {
  for (const selector of DynamicTargetSelectors) {
    const target = await load(() => document.querySelector(selector))

    if (target) {
      target.addEventListener("click", handleClick)
      dynamicTargets.push(target)
    }
  }

  for (const selector of GroupedDynamicTargetSelectors) {
    const targets = await load(() => {
      const els = Array.from(document.querySelectorAll(selector))
      return els.length ? els : null
    })

    if (targets) {
      targets.forEach((target) => target.addEventListener("click", handleClick))
      dynamicTargets.push(...targets)
    }
  }
}

// init the plugin

async function init() {
  notify.trigger({
    content: "Plugin activated!",
  })

  // setup static update triggers

  const searchSubmitBtn = document.querySelector(
    StaticTargetSelectors.SEARCH_SUBMIT_BTN
  )
  const searchDropdown = document.querySelector(
    StaticTargetSelectors.SEARCH_DROPDOWN
  )
  const searchInput = document.querySelector(StaticTargetSelectors.SEARCH_INPUT)

  searchSubmitBtn.addEventListener("click", handleClick)
  searchDropdown.addEventListener("click", handleClick)
  searchInput.addEventListener("keydown", handleKeydown)

  // setup dynamic update triggers

  await tryUpgradeSoldTable()
  await addDynamicTargetListeners()

  // Check if a table exists on load. If so, upgrade it.
}

init()
