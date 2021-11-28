// ==UserScript==
// @name         Super Bay
// @namespace    https://github.com/geotrev/super-bay
// @version      1.0.1
// @description  Automate chores on eBay.
// @author       geotrev
// @match        https://www.ebay.com/*
// @icon         https://i.imgur.com/sTWhpsO.png
// @grant        none
// ==/UserScript==

;(function () {
  "use strict"

  let RUNNING_PROCESS = false

  const FeedbackConfig = {
    DEBUG: false,
    SALE_FEEDBACK_TEXT: "Great buyer + fast payment. Thanks.",
    PURCHASE_FEEDBACK_TEXT:
      "Easy purchase + item arrived as described. Thanks.",
  }

  function log(msg, type = "info") {
    console[type](`[SUPER-BAY]: ${msg}`)
  }

  /**
   * When viewing the below link in your ebay account, press ctrl/cmd+alt+F
   * and this script will automatically fill in all sales/purchase feedback.
   *
   * --> https://www.ebay.com/fdbk/leave_feedback
   *
   * You may need to refresh and do this multiple times to get all your sales/purchases
   * reviewed. Alternatively, you can scroll down through the page until all your
   * sales/purchases are visible, then run the script.
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

    RUNNING_PROCESS = true

    log("Filling feedback...")

    let PURCHASE_FB_COUNT = 0
    let SALE_FB_COUNT = 0
    const items = document.querySelectorAll(".single-feedback-template")
    const length = items.length

    if (length === 0) {
      RUNNING_PROCESS = false
      return log("No feedback, exiting.")
    }

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
      log(
        `Feedback completed for ${PURCHASE_FB_COUNT} seller${
          PURCHASE_FB_COUNT > 1 ? "s" : ""
        }.`
      )
    }

    if (SALE_FB_COUNT > 0) {
      log(
        `Feedback completed for ${SALE_FB_COUNT} buyer${
          SALE_FB_COUNT > 1 ? "s" : ""
        }.`
      )
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
    log("Plugin activated!")
    subscribeFeedback()
  }

  init()
})()
