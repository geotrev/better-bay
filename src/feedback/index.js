import { notify } from "../utils/index.js"
import { PluginConfig, StaticTargetSelectors, Messages } from "./enums.js"

let RUNNING_PROCESS = false

/**
 * HELPERS
 */

function pluralize(word, count) {
  return count > 1 ? word + "s" : word
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
    return notify.trigger({
      content: Messages.NO_FEEDBACK,
    })
  }

  notify.trigger({ content: Messages.FILLING_FEEDBACK })

  function enableSubmit(target) {
    target.dispatchEvent(new Event("blur"))
  }

  for (let i = 0; i < length; i++) {
    const item = items[i]

    if (item.textContent.indexOf("Sold By") > -1) {
      /**
       * Apply on time delivery
       */

      const onTimeInput = item.querySelector(StaticTargetSelectors.ON_TIME_DEL)
      if (onTimeInput) onTimeInput.click()

      /**
       * Apply review type
       */

      const reviewTypeInput = item.querySelector(
        StaticTargetSelectors.OVERALL_EXP
      )
      if (reviewTypeInput) reviewTypeInput.click()

      /**
       * Apply star ratings
       */

      // item description
      const itemDescStar = item.querySelector(
        StaticTargetSelectors.ITEM_AS_DESC
      )
      if (itemDescStar) itemDescStar.click()

      // shipping costs
      const shipCostStar = item.querySelector(
        StaticTargetSelectors.SHIP_CHARGES
      )
      if (shipCostStar) shipCostStar.click()

      // shipping time
      const shipTimeStar = item.querySelector(StaticTargetSelectors.SHIP_TIME)
      if (shipTimeStar) shipTimeStar.click()

      // seller communication
      const sellCommStar = item.querySelector(
        StaticTargetSelectors.SELLER_COMMS
      )
      if (sellCommStar) sellCommStar.click()

      /**
       * Fill in review text
       */

      const overallExpEl = item.querySelector(
        StaticTargetSelectors.EXP_COMMENT_TA
      )
      if (overallExpEl) {
        overallExpEl.value = PluginConfig.PURCHASE_FEEDBACK_TEXT
        enableSubmit(overallExpEl)
      }

      PURCHASE_FB_COUNT += 1
    } else if (item.textContent.indexOf("Purchased by") > -1) {
      /**
       * Apply review type
       */

      const reviewTypeInput = item.querySelector(
        StaticTargetSelectors.OVERALL_EXP
      )
      if (reviewTypeInput) reviewTypeInput.click()

      /**
       * Fill in review text
       */

      const overallExpEl = item.querySelector(
        StaticTargetSelectors.EXP_COMMENT_IN
      )
      if (overallExpEl) {
        overallExpEl.value = PluginConfig.SALE_FEEDBACK_TEXT
        enableSubmit(overallExpEl)
      }

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
    notify.trigger({
      content: `Feedback completed for ${PURCHASE_FB_COUNT} ${pluralize(
        "seller",
        PURCHASE_FB_COUNT
      )}.`,
    })
  }

  if (SALE_FB_COUNT > 0) {
    notify.trigger({
      content: `Feedback completed for ${SALE_FB_COUNT} ${pluralize(
        "buyer",
        SALE_FB_COUNT
      )}.`,
    })
  }

  RUNNING_PROCESS = false
  PluginConfig.DEBUG = false
}

function init() {
  notify.trigger({
    content: Messages.HOW_TO,
  })
  document.addEventListener("keydown", applyFeedback)
}

init()
