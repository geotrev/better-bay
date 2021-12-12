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

async function handleClick(event) {
  if (!event.target.disabled) {
    await refreshDynamicContent()
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

async function refreshDynamicContent() {
  dynamicTargets.forEach((target) =>
    target.removeEventListener("click", handleClick)
  )
  dynamicTargets = []
  tryUpgradeSoldTable()
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
  const categoryFilterDropdown = document.querySelector(
    StaticTargetSelectors.CATEGORY_ITEMS_WRAPPER
  )
  const categoryFilterApplyBtn = document.querySelector(
    StaticTargetSelectors.CATEGORY_APPLY_BTN
  )

  searchSubmitBtn.addEventListener("click", handleClick)
  searchDropdown.addEventListener("click", handleClick)
  searchInput.addEventListener("keydown", handleKeydown)
  categoryFilterDropdown.addEventListener("keydown", handleClick)
  categoryFilterApplyBtn.addEventListener("keydown", handleClick)

  // setup dynamic update triggers

  await addDynamicTargetListeners()

  // Check if a table exists on load. If so, upgrade it.

  tryUpgradeSoldTable()
}

init()
