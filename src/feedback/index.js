import { notify } from "../utils/index.js"
import { PluginConfig, StaticTargetSelectors, Messages } from "./enums.js"

let RUNNING_PROCESS = false

/**
 * HELPERS
 */

function pluralize(word, count) {
  return count > 1 ? word + "s" : word
}

function blurTarget(target) {
  target.dispatchEvent(new Event("blur"))
}

function clickItemTarget(item, selector) {
  const target = item.querySelector(selector)
  if (target) target.click()
}

function fillTextField(item, selector, feedbackText) {
  const overallExpEl = item.querySelector(selector)
  if (overallExpEl) {
    overallExpEl.value = feedbackText
    blurTarget(overallExpEl)
  }
}

function notifyCompleted(word, count) {
  notify({
    content: `Feedback completed for ${count} ${pluralize(word, count)}.`,
  })
}

/**
 * SCRIPT
 */

function applyFeedback(event) {
  if (
    !window.location.pathname.startsWith("/fdbk/leave_feedback") ||
    RUNNING_PROCESS ||
    !["f", "F"].includes(event.key) ||
    !event.altKey ||
    !event.shiftKey
  ) {
    return
  }

  if (event.ctrlKey) PluginConfig.DEBUG = true
  RUNNING_PROCESS = true

  let PURCHASE_FB_COUNT = 0
  let SALE_FB_COUNT = 0
  const items = document.querySelectorAll(StaticTargetSelectors.REVIEW_ITEMS)
  const length = items.length

  if (length === 0) {
    RUNNING_PROCESS = false
    return notify({ content: Messages.NO_FEEDBACK })
  }

  notify({ content: Messages.FILLING_FEEDBACK })

  for (const item of items) {
    if (item.textContent.indexOf("Sold By") > -1) {
      /**
       * Apply on time delivery
       */

      clickItemTarget(item, StaticTargetSelectors.ON_TIME_DEL)

      /**
       * Apply review type
       */

      clickItemTarget(item, StaticTargetSelectors.OVERALL_EXP)

      /**
       * Apply star ratings
       */

      clickItemTarget(item, StaticTargetSelectors.ITEM_AS_DESC)

      /**
       * Apply ship charge
       */

      clickItemTarget(item, StaticTargetSelectors.SHIP_CHARGES)

      /**
       * Apply ship time
       */

      clickItemTarget(item, StaticTargetSelectors.SHIP_TIME)

      /**
       * Apply seller comms
       */

      clickItemTarget(item, StaticTargetSelectors.SELLER_COMMS)

      /**
       * Fill in review text
       */

      fillTextField(
        item,
        StaticTargetSelectors.EXP_COMMENT_TA,
        PluginConfig.PURCHASE_FEEDBACK_TEXT
      )

      PURCHASE_FB_COUNT += 1
    } else if (item.textContent.indexOf("Purchased by") > -1) {
      /**
       * Apply review type
       */

      clickItemTarget(item, StaticTargetSelectors.OVERALL_EXP)

      /**
       * Fill in review text
       */

      fillTextField(
        item,
        StaticTargetSelectors.EXP_COMMENT_IN,
        PluginConfig.SALE_FEEDBACK_TEXT
      )

      SALE_FB_COUNT += 1
    }
  }

  if (!PluginConfig.DEBUG) {
    const submitBtns = document.querySelectorAll(
      StaticTargetSelectors.SUBMIT_BTN
    )
    if (submitBtns.length) {
      submitBtns.forEach((b) => !b.disabled && b.click())
    }
  }

  if (PURCHASE_FB_COUNT > 0) {
    notifyCompleted("seller", PURCHASE_FB_COUNT)
  }

  if (SALE_FB_COUNT > 0) {
    notifyCompleted("buyer", SALE_FB_COUNT)
  }

  RUNNING_PROCESS = false
  PluginConfig.DEBUG = false
}

function init() {
  notify({ content: Messages.HOW_TO })
  document.addEventListener("keydown", applyFeedback)
}

init()
