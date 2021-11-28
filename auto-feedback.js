// ==UserScript==
// @name         Super Bay - Auto Feedback
// @namespace    https://github.com/geotrev/super-bay
// @version      1.0.5
// @description  Automate feedback on eBay with Alt+Shift+F
// @author       geotrev
// @match        https://www.ebay.com/fdbk/leave_feedback*
// @icon         https://i.imgur.com/sTWhpsO.png
// @grant        none
// ==/UserScript==

;(function () {
  "use strict"

  class SuperEbayNotify {
    constructor() {
      const notifyWrapperTemp = document.createElement("div")
      const notifyElTemp = document.createElement("div")

      notifyWrapperTemp.innerHTML =
        '<div style="position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 48px 16px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>'
      notifyElTemp.innerHTML =
        '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;font-weight: bold;font-size: 12px;">[Super Bay]</h3><p style="font-size: 16px;line-height: 22px;" data-notify-content></p></section>'

      this.notifyWrapper = notifyWrapperTemp.firstElementChild
      this.notifyEl = notifyElTemp.firstElementChild

      document.body.appendChild(this.notifyWrapper)
      this.destroy = this.destroy.bind(this)
    }

    create({ content }) {
      const notify = this.notifyEl.cloneNode(true)
      notify.querySelector("p").innerText = content

      this.notifyWrapper.appendChild(notify)
      setTimeout(this.destroy, 2000)
    }

    destroy() {
      this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild)
    }
  }

  window.superEbayNotify = new SuperEbayNotify()
})()
;(function () {
  "use strict"

  let RUNNING_PROCESS = false

  const FeedbackConfig = {
    DEBUG: false,
    SALE_FEEDBACK_TEXT: "Great buyer + fast payment. Thanks.",
    PURCHASE_FEEDBACK_TEXT:
      "Easy purchase + item arrived as described. Thanks.",
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

    RUNNING_PROCESS = true

    window.superEbayNotify({ content: "Filling feedback..." })

    let PURCHASE_FB_COUNT = 0
    let SALE_FB_COUNT = 0
    const items = document.querySelectorAll(".single-feedback-template")
    const length = items.length

    if (length === 0) {
      RUNNING_PROCESS = false
      return window.superEbayNotify({ content: "No feedback, exiting." })
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
      window.superEbayNotify({
        content: `Feedback completed for ${PURCHASE_FB_COUNT} ${pluralize(
          "seller",
          PURCHASE_FB_COUNT
        )}.`,
      })
    }

    if (SALE_FB_COUNT > 0) {
      window.superEbayNotify({
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
    window.superEbayNotify({
      content: "Plugin activated! Press Alt+Shift+F to fill out feedback.",
    })
    subscribeFeedback()
  }

  init()
})()
