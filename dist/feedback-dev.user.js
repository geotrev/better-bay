// ==UserScript==
// @name        Better Bay - Feedback
// @description Automate feedback on ebay
// @namespace   https://github.com/geotrev/better-bay
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.ebay.com/fdbk/leave_feedback*
// @version     2.0.0-beta.1
// @downloadURL https://github.com/geotrev/better-bay/raw/develop/dist/feedback-dev.user.js
// @updateURL   https://github.com/geotrev/better-bay/raw/develop/dist/feedback-dev.user.js
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  function Notify() {
    const notifyWrapperTemp = document.createElement("div");
    const notifyElTemp = document.createElement("div");

    notifyWrapperTemp.innerHTML =
      '<div style="position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 48px 16px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>';
    notifyElTemp.innerHTML =
      '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;">[Better Bay]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0;" data-notify-content></p></section>';

    const notifyWrapper = notifyWrapperTemp.firstElementChild;
    const notifyEl = notifyElTemp.firstElementChild;
    let queue = 0;

    const DEFAULT_DELAY = 2000;

    function queueIsEmpty() {
      return queue <= 0
    }

    function dismiss() {
      if (queueIsEmpty()) return

      notifyWrapper.removeChild(notifyWrapper.firstElementChild);
      queue -= 1;
    }

    function handleKeydown(e) {
      if (queueIsEmpty() || e.key !== "Escape") return

      e.preventDefault();
      dismiss();
    }

    function trigger({ content, delay = DEFAULT_DELAY }) {
      const notify = notifyEl.cloneNode(true);
      notify.querySelector("p").innerText = content;

      notifyWrapper.appendChild(notify);
      queue += 1;
      setTimeout(dismiss, delay);
    }

    document.body.appendChild(notifyWrapper);
    document.addEventListener("keydown", handleKeydown, true);

    return trigger
  }

  const notify = new Notify();

  const PluginConfig = {
    SUBMIT: false,
    SALE_FEEDBACK_TEXT: "Great buyer + fast payment. Thanks.",
    PURCHASE_FEEDBACK_TEXT: "Easy purchase + item arrived as described. Thanks.",
  };

  const StaticTargetSelectors = {
    REVIEW_ITEMS: ".single-feedback-template",
    ON_TIME_DEL: 'input[value="2"][name^="ON_TIME_DELIVERY"]',
    OVERALL_EXP: 'input[value="POSITIVE"][name^="OVERALL_EXPERIENCE"]',
    ITEM_AS_DESC: 'input[value="5"][name^="DSR_ITEM_AS_DESCRIBED"]',
    SHIP_CHARGES: 'input[value="5"][name^="DSR_SHIPPING_CHARGES"]',
    SHIP_TIME: 'input[value="5"][name^="DSR_SHIPPING_TIME"]',
    SELLER_COMMS: 'input[value="5"][name^="DSR_COMMUNICATION"]',
    EXP_COMMENT_TA: 'textarea[name="OVERALL_EXPERIENCE_COMMENT"]',
    EXP_COMMENT_IN: 'input[name="OVERALL_EXPERIENCE_COMMENT"]',
    SUBMIT_BTN: 'button[id^="submitFeedbackBtn-"]',
  };

  const Messages = {
    NO_FEEDBACK: "No feedback, exiting.",
    FILLING_FEEDBACK: "Filling feedback...",
    HOW_TO:
      "Better Bay activated! Press Ctrl+Shift+F to fill all feedback OR Ctrl+Shift+Alt+F to fill & submit feedback.",
  };

  let RUNNING_PROCESS = false;

  /**
   * HELPERS
   */

  function pluralize(word, count) {
    return count > 1 ? word + "s" : word
  }

  function blurTarget(target) {
    target.dispatchEvent(new Event("blur"));
  }

  function clickItemTarget(item, selector) {
    const target = item.querySelector(selector);
    if (target) target.click();
  }

  function fillTextField(item, selector, feedbackText) {
    const overallExpEl = item.querySelector(selector);
    if (overallExpEl) {
      overallExpEl.value = feedbackText;
      blurTarget(overallExpEl);
    }
  }

  function notifyCompleted(word, count) {
    notify({
      content: `Feedback completed for ${count} ${pluralize(word, count)}.`,
    });
  }

  /**
   * SCRIPT
   */

  function applyFeedback(event) {
    if (
      !window.location.pathname.startsWith("/fdbk/leave_feedback") ||
      RUNNING_PROCESS ||
      !["f", "F"].includes(event.key) ||
      !event.ctrlKey ||
      !event.shiftKey
    ) {
      return
    }

    if (event.altKey) PluginConfig.SUBMIT = true;
    RUNNING_PROCESS = true;

    let PURCHASE_FB_COUNT = 0;
    let SALE_FB_COUNT = 0;
    const items = document.querySelectorAll(StaticTargetSelectors.REVIEW_ITEMS);
    const length = items.length;

    if (length === 0) {
      RUNNING_PROCESS = false;
      return notify({ content: Messages.NO_FEEDBACK })
    }

    notify({ content: Messages.FILLING_FEEDBACK });

    for (const item of items) {
      if (item.textContent.indexOf("Sold By") > -1) {
        /**
         * Apply on time delivery
         */

        clickItemTarget(item, StaticTargetSelectors.ON_TIME_DEL);

        /**
         * Apply review type
         */

        clickItemTarget(item, StaticTargetSelectors.OVERALL_EXP);

        /**
         * Apply star ratings
         */

        clickItemTarget(item, StaticTargetSelectors.ITEM_AS_DESC);

        /**
         * Apply ship charge
         */

        clickItemTarget(item, StaticTargetSelectors.SHIP_CHARGES);

        /**
         * Apply ship time
         */

        clickItemTarget(item, StaticTargetSelectors.SHIP_TIME);

        /**
         * Apply seller comms
         */

        clickItemTarget(item, StaticTargetSelectors.SELLER_COMMS);

        /**
         * Fill in review text
         */

        fillTextField(
          item,
          StaticTargetSelectors.EXP_COMMENT_TA,
          PluginConfig.PURCHASE_FEEDBACK_TEXT
        );

        PURCHASE_FB_COUNT += 1;
      } else if (item.textContent.indexOf("Purchased by") > -1) {
        /**
         * Apply review type
         */

        clickItemTarget(item, StaticTargetSelectors.OVERALL_EXP);

        /**
         * Fill in review text
         */

        fillTextField(
          item,
          StaticTargetSelectors.EXP_COMMENT_IN,
          PluginConfig.SALE_FEEDBACK_TEXT
        );

        SALE_FB_COUNT += 1;
      }
    }

    if (PluginConfig.SUBMIT) {
      const submitBtns = document.querySelectorAll(
        StaticTargetSelectors.SUBMIT_BTN
      );
      if (submitBtns.length) {
        submitBtns.forEach((b) => !b.disabled && b.click());
      }
    }

    if (PURCHASE_FB_COUNT > 0) {
      notifyCompleted("seller", PURCHASE_FB_COUNT);
    }

    if (SALE_FB_COUNT > 0) {
      notifyCompleted("buyer", SALE_FB_COUNT);
    }

    RUNNING_PROCESS = false;
    PluginConfig.SUBMIT = false;
  }

  function init() {
    notify({ content: Messages.HOW_TO });
    document.addEventListener("keydown", applyFeedback);
  }

  init();

})();
