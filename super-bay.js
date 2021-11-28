/**
 * This script will automatically fill in all purchase feedback when viewing the below link.
 *
 * --> https://www.ebay.com/fdbk/leave_feedback
 *
 * Why? Leaving feedback is annoying. Let a script do it for you. It takes a basic
 * configuration below and assigns 5 stars to everything. You can optionally
 * change the feedback text for either a sale or purchase. It also assumes
 * you've already left critical feedback for any given sale/purchase BEFORE
 * running the script. In other words, it won't skip anything and you should
 * double check before running the script that you don't mind a 5 star rating be
 * applied to all items.
 *
 * How to use (assumes chrome browser):
 * 1. Navigate to the link at the top of this file.
 * 2. Press ctrl+i (or cmd+i for macOS) to open dev tools. Go to the "Console" tab.
 * 3. Paste the below script into the console and press Enter.
 *
 * You may need to refresh and do this multiple times to get all your sales/purchases
 * reviewed. Alternatively, you can scroll down through the page until all your
 * sales/purchases are visible, then run the script.
 */

/* COPY AND PASTE FROM HERE DOWN */

const Config = {
  WILL_SUBMIT: true,
  SALE_FEEDBACK_TEXT: "Great buyer + fast payment. Thanks.",
  PURCHASE_FEEDBACK_TEXT: "Easy purchase + item arrived as described. Thanks.",
}

function applyFeedback(event) {
  if (
    !window.location.pathname.startsWith("/fdbk/leave_feedback") ||
    !["f", "F"].includes(event.key) ||
    !event.altKey ||
    !event.shiftKey
  ) {
    return
  }

  let PURCHASE_FB_COUNT = 0
  let SALE_FB_COUNT = 0
  const items = document.querySelectorAll(".single-feedback-template")
  const length = items.length

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
        `input[value="2"][name^="ON_TIME_DELIVERY"]`
      )
      if (onTimeInput) onTimeInput.click()

      /**
       * Apply review type
       */

      const reviewTypeInput = item.querySelector(
        `input[value="POSITIVE"][name^="OVERALL_EXPERIENCE"]`
      )
      if (reviewTypeInput) reviewTypeInput.click()

      /**
       * Apply star ratings
       */

      // item description
      const itemDescStar = item.querySelector(
        `input[value="5"][name^="DSR_ITEM_AS_DESCRIBED"]`
      )
      if (itemDescStar) itemDescStar.click()

      // shipping costs
      const shipCostStar = item.querySelector(
        `input[value="5"][name^="DSR_SHIPPING_CHARGES"]`
      )
      if (shipCostStar) shipCostStar.click()

      // shipping time
      const shipTimeStar = item.querySelector(
        `input[value="5"][name^="DSR_SHIPPING_TIME"]`
      )
      if (shipTimeStar) shipTimeStar.click()

      // seller communication
      const sellCommStar = item.querySelector(
        `input[value="5"][name^="DSR_COMMUNICATION"]`
      )
      if (sellCommStar) sellCommStar.click()

      /**
       * Fill in review text
       */

      const overallExpEl = item.querySelector(
        "textarea[name='OVERALL_EXPERIENCE_COMMENT']"
      )
      if (overallExpEl) {
        overallExpEl.value = Config.PURCHASE_FEEDBACK_TEXT
        enableSubmit(overallExpEl)
      }

      PURCHASE_FB_COUNT += 1
    } else if (item.textContent.indexOf("Purchased by") > -1) {
      /**
       * Apply review type
       */

      const reviewTypeInput = item.querySelector(
        `input[value="POSITIVE"][name^="OVERALL_EXPERIENCE"]`
      )
      if (reviewTypeInput) reviewTypeInput.click()

      /**
       * Fill in review text
       */

      const overallExpEl = item.querySelector(
        "input[name='OVERALL_EXPERIENCE_COMMENT']"
      )
      if (overallExpEl) {
        overallExpEl.value = Config.SALE_FEEDBACK_TEXT
        enableSubmit(overallExpEl)
      }

      SALE_FB_COUNT += 1
    }
  }

  if (PURCHASE_FB_COUNT > 0) {
    console.log(
      `Feedback completed for ${PURCHASE_FB_COUNT} seller${
        PURCHASE_FB_COUNT > 1 ? "s" : ""
      }.`
    )
  }

  if (SALE_FB_COUNT > 0) {
    console.log(
      `Feedback completed for ${SALE_FB_COUNT} buyer${
        SALE_FB_COUNT > 1 ? "s" : ""
      }.`
    )
  }

  if (Config.WILL_SUBMIT) {
    const submitBtns = document.querySelectorAll(
      'button[id^="submitFeedbackBtn-"]'
    )
    if (submitBtns.length) {
      submitBtns.forEach((b) => !b.disabled && b.click())
    }
  }
}

/**
 * Listener functions
 */

function subscribeFeedback() {
  window.addEventListener("keydown", applyFeedback)
}

/**
 * Initialize script
 */

function init() {
  subscribeFeedback()
}

init()
