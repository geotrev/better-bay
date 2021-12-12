// ==UserScript==
// @name        Super Bay - Research
// @description Better controls in seller hub research
// @namespace   https://github.com/geotrev/super-bay
// @version     1.0.15-beta.1
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.ebay.com/sh/research*
// @downloadURL https://github.com/geotrev/super-bay/raw/develop/dist/research-beta.user.js
// @updateURL   https://github.com/geotrev/super-bay/raw/develop/dist/research-beta.user.js
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

  async function load(callback, failMsg, tries = 50) {
    let i = -1,
      res = null;

    while (++i < tries) {
      await new Promise((done) =>
        setTimeout(() => {
          res = callback();
          done();
        }, 250)
      );

      if (res) {
        return res
      }
    }

    if (failMsg) {
      notify.trigger({ content: failMsg });
    }
  }

  const StaticTargetSelectors = {
    SOLD_RESULT_TABLE: ".sold-result-table",
    SEARCH_INPUT: ".research-container input",
    SEARCH_DROPDOWN: ".search-input-panel__dropdown",
    TABLE_ROW: ".research-table-row",
    TABLE_ROW_ANCHOR: ".research-table-row__link-row-anchor",
    SEARCH_SUBMIT_BTN: ".search-input-panel__research-button",
    CATEGORY_APPLY_BTN: ".category-selection-panel .filter-menu-button__footer",
    CATEGORY_ITEMS_WRAPPER:
      ".category-selection-panel .filter-menu-button__items",
  };

  const DynamicTargetSelectors = [".tabs__items"];

  const GroupedDynamicTargetSelectors = [
    ".filters-panel .filter-menu-button__footer",
    ".search-filter-pills .filter-pill__close",
  ];

  const Colors = {
    NO_ANCHOR_BG_COLOR: "#EFEFEF",
  };

  let dynamicTargets = [];

  function upgradeSoldTable() {
    notify.trigger({
      content: "Table upgraded. Removed listings have a darker background color.",
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

  // checks if the table exists before upgrading it.

  async function tryUpgradeSoldTable() {
    const table = await load(
      () => document.querySelector(StaticTargetSelectors.SOLD_RESULT_TABLE),
      "Results table took too long to load. Try again."
    );

    if (table) upgradeSoldTable();
  }

  // event listeners

  async function handleClick(event) {
    if (!event.target.disabled) {
      await tryUpgradeSoldTable();
      await removeDynamicTargetListeners();

      setTimeout(addDynamicTargetListeners, 2000);
    }
  }

  function handleKeydown(event) {
    if (event.key === "Enter") tryUpgradeSoldTable();
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

  async function removeDynamicTargetListeners() {
    dynamicTargets.forEach((target) =>
      target.removeEventListener("click", handleClick)
    );
    dynamicTargets = [];
  }

  // init the plugin

  async function init() {
    notify.trigger({
      content: "Plugin activated!",
    });

    // setup static update triggers

    const searchSubmitBtn = document.querySelector(
      StaticTargetSelectors.SEARCH_SUBMIT_BTN
    );
    const searchDropdown = document.querySelector(
      StaticTargetSelectors.SEARCH_DROPDOWN
    );
    const searchInput = document.querySelector(StaticTargetSelectors.SEARCH_INPUT);
    const categoryFilterDropdown = document.querySelector(
      StaticTargetSelectors.CATEGORY_ITEMS_WRAPPER
    );
    const categoryFilterApplyBtn = document.querySelector(
      StaticTargetSelectors.CATEGORY_APPLY_BTN
    );

    searchSubmitBtn.addEventListener("click", handleClick);
    searchDropdown.addEventListener("click", handleClick);
    searchInput.addEventListener("keydown", handleKeydown);
    categoryFilterDropdown.addEventListener("keydown", handleClick);
    categoryFilterApplyBtn.addEventListener("keydown", handleClick);

    // setup dynamic update triggers

    await addDynamicTargetListeners();

    // Check if a table exists on load. If so, upgrade it.

    tryUpgradeSoldTable();
  }

  init();

})();
