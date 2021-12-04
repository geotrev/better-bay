import { notify } from "../utils/index.js"

let RUNNING_PROCESS = false

const FeedbackConfig = {
  DEBUG: false,
  SALE_FEEDBACK_TEXT: "Great buyer + fast payment. Thanks.",
  PURCHASE_FEEDBACK_TEXT: "Easy purchase + item arrived as described. Thanks.",
}

/**
 * HELPERS
 */

function pluralize(word, count) {
  return count > 1 ? word + "s" : word
}

/**
 * EVENT BINDINGS
 */

function applyFeedback(event) {
  if (
    !window.location.pathname.startsWith("/fdbk/leave_feedback") ||
    !["f", "F"].includes(event.key) ||
    !event.altKey ||
    !event.shiftKey
  ) {
    return
  }

  if (event.ctrlKey) {
    FeedbackConfig.DEBUG = true
  }

  RUNNING_PROCESS = true

  let PURCHASE_FB_COUNT = 0
  let SALE_FB_COUNT = 0
  const items = document.querySelectorAll(".single-feedback-template")
  const length = items.length

  if (length === 0) {
    RUNNING_PROCESS = false
    return notify.trigger({
      content: "No feedback, exiting.",
    })
  }

  notify.trigger({ content: "Filling feedback..." })

  function enableSubmit(target) {
    target.dispatchEvent(new Event("blur"))
  }

  for (let i = 0; i < length; i++) {
    const item = items[i]

    if (item.textContent.indexOf("Sold By") > -1) {
      /**
       * Apply on time delivery
       */

      const onTimeInput = item.querySelector(
        'input[value="2"][name^="ON_TIME_DELIVERY"]'
      )
      if (onTimeInput) onTimeInput.click()

      /**
       * Apply review type
       */

      const reviewTypeInput = item.querySelector(
        'input[value="POSITIVE"][name^="OVERALL_EXPERIENCE"]'
      )
      if (reviewTypeInput) reviewTypeInput.click()

      /**
       * Apply star ratings
       */

      // item description
      const itemDescStar = item.querySelector(
        'input[value="5"][name^="DSR_ITEM_AS_DESCRIBED"]'
      )
      if (itemDescStar) itemDescStar.click()

      // shipping costs
      const shipCostStar = item.querySelector(
        'input[value="5"][name^="DSR_SHIPPING_CHARGES"]'
      )
      if (shipCostStar) shipCostStar.click()

      // shipping time
      const shipTimeStar = item.querySelector(
        'input[value="5"][name^="DSR_SHIPPING_TIME"]'
      )
      if (shipTimeStar) shipTimeStar.click()

      // seller communication
      const sellCommStar = item.querySelector(
        'input[value="5"][name^="DSR_COMMUNICATION"]'
      )
      if (sellCommStar) sellCommStar.click()

      /**
       * Fill in review text
       */

      const overallExpEl = item.querySelector(
        'textarea[name="OVERALL_EXPERIENCE_COMMENT"]'
      )
      if (overallExpEl) {
        overallExpEl.value = FeedbackConfig.PURCHASE_FEEDBACK_TEXT
        enableSubmit(overallExpEl)
      }

      PURCHASE_FB_COUNT += 1
    } else if (item.textContent.indexOf("Purchased by") > -1) {
      /**
       * Apply review type
       */

      const reviewTypeInput = item.querySelector(
        'input[value="POSITIVE"][name^="OVERALL_EXPERIENCE"]'
      )
      if (reviewTypeInput) reviewTypeInput.click()

      /**
       * Fill in review text
       */

      const overallExpEl = item.querySelector(
        'input[name="OVERALL_EXPERIENCE_COMMENT"]'
      )
      if (overallExpEl) {
        overallExpEl.value = FeedbackConfig.SALE_FEEDBACK_TEXT
        enableSubmit(overallExpEl)
      }

      SALE_FB_COUNT += 1
    }
  }

  if (!FeedbackConfig.DEBUG) {
    const submitBtns = document.querySelectorAll(
      'button[id^="submitFeedbackBtn-"]'
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
}

/**
 * Listener functions
 */

function subscribeFeedback() {
  document.addEventListener("keydown", applyFeedback)
}

/**
 * Initialize script
 */

function init() {
  notify.trigger({
    content: "Plugin activated! Press Alt+Shift+F to fill out feedback.",
  })
  subscribeFeedback()
}

init()
