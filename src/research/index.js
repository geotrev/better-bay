import { load, notify } from "../utils/index.js"
import {
  StaticTargetSelectors,
  DynamicTargetSelectors,
  GroupedDynamicTargetSelectors,
  Colors,
  Messages,
} from "./enums.js"

/**
 * SCRIPT
 */

let dynamicTargets = []

function upgradeSoldTable() {
  notify({
    content: Messages.TABLE_UPGRADED,
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

async function tryUpgradeSoldTable() {
  const table = await load(
    () => document.querySelector(StaticTargetSelectors.SOLD_RESULT_TABLE),
    Messages.TABLE_UPGRADE_FAILED
  )

  if (table) upgradeSoldTable()
}

function handleClick(event) {
  if (!event.target.disabled) {
    setTimeout(refreshDynamicContent, 2000)
  }
}

function handleKeydown(event) {
  if (event.key === "Enter") {
    setTimeout(refreshDynamicContent, 2000)
  }
}

async function refreshDynamicContent() {
  await tryUpgradeSoldTable()

  dynamicTargets.forEach((target) =>
    target.removeEventListener("click", handleClick)
  )
  dynamicTargets = []

  addDynamicTargetListeners()
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

async function init() {
  notify({
    content: Messages.PLUGIN_ACTIVATED,
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

  // upgrade table + setup dynamic update triggers

  await tryUpgradeSoldTable()
  await addDynamicTargetListeners()
}

init()
