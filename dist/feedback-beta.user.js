// ==UserScript==
// @name        Super Bay - Feedback
// @description Automate feedback on ebay
// @namespace   https://github.com/geotrev/super-bay
// @version     1.0.16-beta.0
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.ebay.com/fdbk/leave_feedback*
// @downloadURL https://github.com/geotrev/super-bay/raw/develop/dist/feedback-beta.user.js
// @updateURL   https://github.com/geotrev/super-bay/raw/develop/dist/feedback-beta.user.js
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  class Notify {
    constructor() {
      const notifyWrapperTemp = document.createElement("div");
      const notifyElTemp = document.createElement("div");

      notifyWrapperTemp.innerHTML =
        '<div style="position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 48px 16px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>';
      notifyElTemp.innerHTML =
        '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;">[Super Bay]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0;" data-notify-content></p></section>';

      this.notifyWrapper = notifyWrapperTemp.firstElementChild;
      this.notifyEl = notifyElTemp.firstElementChild;

      document.body.appendChild(this.notifyWrapper);
      this.destroy = this.destroy.bind(this);
    }

    trigger({ content }) {
      const notify = this.notifyEl.cloneNode(true);
      notify.querySelector("p").innerText = content;

      this.notifyWrapper.appendChild(notify);
      setTimeout(this.destroy, 2000);
    }

    destroy() {
      this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild);
    }
  }

  const notify = new Notify();

  let RUNNING_PROCESS = false;

  const FeedbackConfig = {
    DEBUG: false,
    SALE_FEEDBACK_TEXT: "Great buyer + fast payment. Thanks.",
    PURCHASE_FEEDBACK_TEXT: "Easy purchase + item arrived as described. Thanks.",
  };

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
      RUNNING_PROCESS ||
      !["f", "F"].includes(event.key) ||
      !event.altKey ||
      !event.shiftKey
    ) {
      return
    }

    if (event.ctrlKey) FeedbackConfig.DEBUG = true;
    RUNNING_PROCESS = true;

    let PURCHASE_FB_COUNT = 0;
    let SALE_FB_COUNT = 0;
    const items = document.querySelectorAll(".single-feedback-template");
    const length = items.length;

    if (length === 0) {
      RUNNING_PROCESS = false;
      return notify.trigger({
        content: "No feedback, exiting.",
      })
    }

    notify.trigger({ content: "Filling feedback..." });

    function enableSubmit(target) {
      target.dispatchEvent(new Event("blur"));
    }

    for (let i = 0; i < length; i++) {
      const item = items[i];

      if (item.textContent.indexOf("Sold By") > -1) {
        /**
         * Apply on time delivery
         */

        const onTimeInput = item.querySelector(
          'input[value="2"][name^="ON_TIME_DELIVERY"]'
        );
        if (onTimeInput) onTimeInput.click();

        /**
         * Apply review type
         */

        const reviewTypeInput = item.querySelector(
          'input[value="POSITIVE"][name^="OVERALL_EXPERIENCE"]'
        );
        if (reviewTypeInput) reviewTypeInput.click();

        /**
         * Apply star ratings
         */

        // item description
        const itemDescStar = item.querySelector(
          'input[value="5"][name^="DSR_ITEM_AS_DESCRIBED"]'
        );
        if (itemDescStar) itemDescStar.click();

        // shipping costs
        const shipCostStar = item.querySelector(
          'input[value="5"][name^="DSR_SHIPPING_CHARGES"]'
        );
        if (shipCostStar) shipCostStar.click();

        // shipping time
        const shipTimeStar = item.querySelector(
          'input[value="5"][name^="DSR_SHIPPING_TIME"]'
        );
        if (shipTimeStar) shipTimeStar.click();

        // seller communication
        const sellCommStar = item.querySelector(
          'input[value="5"][name^="DSR_COMMUNICATION"]'
        );
        if (sellCommStar) sellCommStar.click();

        /**
         * Fill in review text
         */

        const overallExpEl = item.querySelector(
          'textarea[name="OVERALL_EXPERIENCE_COMMENT"]'
        );
        if (overallExpEl) {
          overallExpEl.value = FeedbackConfig.PURCHASE_FEEDBACK_TEXT;
          enableSubmit(overallExpEl);
        }

        PURCHASE_FB_COUNT += 1;
      } else if (item.textContent.indexOf("Purchased by") > -1) {
        /**
         * Apply review type
         */

        const reviewTypeInput = item.querySelector(
          'input[value="POSITIVE"][name^="OVERALL_EXPERIENCE"]'
        );
        if (reviewTypeInput) reviewTypeInput.click();

        /**
         * Fill in review text
         */

        const overallExpEl = item.querySelector(
          'input[name="OVERALL_EXPERIENCE_COMMENT"]'
        );
        if (overallExpEl) {
          overallExpEl.value = FeedbackConfig.SALE_FEEDBACK_TEXT;
          enableSubmit(overallExpEl);
        }

        SALE_FB_COUNT += 1;
      }
    }

    if (!FeedbackConfig.DEBUG) {
      const submitBtns = document.querySelectorAll(
        'button[id^="submitFeedbackBtn-"]'
      );
      if (submitBtns.length) {
        submitBtns.forEach((b) => !b.disabled && b.click());
      }
    }

    if (PURCHASE_FB_COUNT > 0) {
      notify.trigger({
        content: `Feedback completed for ${PURCHASE_FB_COUNT} ${pluralize(
        "seller",
        PURCHASE_FB_COUNT
      )}.`,
      });
    }

    if (SALE_FB_COUNT > 0) {
      notify.trigger({
        content: `Feedback completed for ${SALE_FB_COUNT} ${pluralize(
        "buyer",
        SALE_FB_COUNT
      )}.`,
      });
    }

    RUNNING_PROCESS = false;
  }
  /**
   * Initialize script
   */

  function init() {
    notify.trigger({
      content: "Plugin activated! Press Alt+Shift+F to fill out feedback.",
    });
    document.addEventListener("keydown", applyFeedback);
  }

  init();

})();
