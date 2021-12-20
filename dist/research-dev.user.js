// ==UserScript==
// @name        Better Bay - Research
// @description Better controls in seller hub research
// @namespace   https://github.com/geotrev/better-bay
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.ebay.com/sh/research*
// @version     1.0.16-beta.3
// @downloadURL https://github.com/geotrev/better-bay/raw/develop/dist/research-dev.user.js
// @updateURL   https://github.com/geotrev/better-bay/raw/develop/dist/research-dev.user.js
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
      '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;">[Super Bay]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0;" data-notify-content></p></section>';

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

  /**
   * Repeatedly checks a callback until it returns a truthy value.
   *
   * @param {Function} callback - callback to resolve.
   * @param {string} failMsg - message that is output if the resolver fails.
   * @param {{tries, interval}} timing - the number of tries and the interval between tries.
   */
  async function load(callback, failMsg, timing = {}) {
    const tries = timing.tries || 50;
    const interval = timing.interval || 100;
    const defaultFailMsg =
      "Unable to resolve value after," + String(tries * interval) + "ms.";

    return new Promise((resolve, reject) => {
      let i;
      const int = setInterval(() => {
        const value = callback();
        if (value) {
          clearInterval(int);
          resolve(value);
        }

        if (++i === tries) {
          clearInterval(int);
          if (failMsg) {
            notify({ content: failMsg || defaultFailMsg });
          }
          reject();
        }
      }, interval);
    })
  }

  const StaticTargetSelectors = {
    SOLD_RESULT_TABLE: ".sold-result-table",
    SEARCH_INPUT: ".research-container input",
    SEARCH_DROPDOWN: ".search-input-panel__dropdown",
    SEARCH_SUBMIT_BTN: ".search-input-panel__research-button",
    TABLE_ROW: ".research-table-row",
    TABLE_ROW_ANCHOR: ".research-table-row__link-row-anchor",
  };

  const DynamicTargetSelectors = [
    ".tabs__items",
    ".category-selection-panel .filter-menu-button__items",
    ".category-selection-panel .filter-menu-button__footer",
  ];

  const GroupedDynamicTargetSelectors = [
    ".filters-panel .filter-menu-button__footer",
    ".search-filter-pills .filter-pill__close",
  ];

  const Colors = {
    NO_ANCHOR_BG_COLOR: "#EFEFEF",
  };

  const Messages = {
    PLUGIN_ACTIVATED: "Plugin activated!",
    TABLE_UPGRADED:
      "Table upgraded. Removed listings have a darker background color.",
    TABLE_UPGRADE_FAILED: "Results table took too long to load. Try again.",
  };

  /**
   * SCRIPT
   */

  let dynamicTargets = [];

  function upgradeSoldTable() {
    notify({
      content: Messages.TABLE_UPGRADED,
    });

    const table = document.querySelector(StaticTargetSelectors.SOLD_RESULT_TABLE);
    const tableRows = table.querySelectorAll(StaticTargetSelectors.TABLE_ROW);

    for (const row of tableRows) {
      const anchor = row.querySelector(StaticTargetSelectors.TABLE_ROW_ANCHOR);

      if (!anchor) {
        row.style.backgroundColor = Colors.NO_ANCHOR_BG_COLOR;
      }
    }
  }

  async function tryUpgradeSoldTable() {
    const table = await load(
      () => document.querySelector(StaticTargetSelectors.SOLD_RESULT_TABLE),
      Messages.TABLE_UPGRADE_FAILED
    );

    if (table) upgradeSoldTable();
  }

  function handleClick(event) {
    if (!event.target.disabled) {
      setTimeout(refreshDynamicContent, 2000);
    }
  }

  function handleKeydown(event) {
    if (event.key === "Enter") {
      setTimeout(refreshDynamicContent, 2000);
    }
  }

  async function refreshDynamicContent() {
    await tryUpgradeSoldTable();

    dynamicTargets.forEach((target) =>
      target.removeEventListener("click", handleClick)
    );
    dynamicTargets = [];

    addDynamicTargetListeners();
  }

  async function addDynamicTargetListeners() {
    for (const selector of DynamicTargetSelectors) {
      const target = await load(() => document.querySelector(selector));

      if (target) {
        target.addEventListener("click", handleClick);
        dynamicTargets.push(target);
      }
    }

    for (const selector of GroupedDynamicTargetSelectors) {
      const targets = await load(() => {
        const els = Array.from(document.querySelectorAll(selector));
        return els.length ? els : null
      });

      if (targets) {
        targets.forEach((target) => target.addEventListener("click", handleClick));
        dynamicTargets.push(...targets);
      }
    }
  }

  async function init() {
    notify({
      content: Messages.PLUGIN_ACTIVATED,
    });

    // setup static update triggers

    const searchSubmitBtn = document.querySelector(
      StaticTargetSelectors.SEARCH_SUBMIT_BTN
    );
    const searchDropdown = document.querySelector(
      StaticTargetSelectors.SEARCH_DROPDOWN
    );
    const searchInput = document.querySelector(StaticTargetSelectors.SEARCH_INPUT);

    searchSubmitBtn.addEventListener("click", handleClick);
    searchDropdown.addEventListener("click", handleClick);
    searchInput.addEventListener("keydown", handleKeydown);

    // upgrade table + setup dynamic update triggers

    await tryUpgradeSoldTable();
    await addDynamicTargetListeners();

    // Check if a table exists on load. If so, upgrade it.
  }

  init();

})();
