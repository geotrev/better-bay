// ==UserScript==
// @name        Super Bay - Research
// @description Better controls in seller hub research
// @namespace   https://github.com/geotrev/super-bay
// @version     1.0.14
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.ebay.com/sh/research*
// @downloadURL https://github.com/geotrev/super-bay/raw/develop/dist/research.user.js
// @updateURL   https://github.com/geotrev/super-bay/raw/develop/dist/research.user.js
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

  async function load(callback, content, tries = 20) {
    let i = -1,
      res = null;

    while (++i < tries) {
      await new Promise((done) =>
        setTimeout(() => {
          res = callback();
          done();
        }, 250)
      );

      if (res) return res
    }

    if (content) notify.trigger({ content });
  }

  const Selectors = {
    SOLD_RESULT_TABLE: ".sold-result-table",
    SEARCH: ".research-container input",
    TABLE_ROW: ".research-table-row",
    TABLE_ROW_ANCHOR: ".research-table-row__link-row-anchor",
  };

  const RefreshTargets = [
    ".search-input-panel__research-button",
    ".search-input-panel__dropdown",
    ".tabs__items",
  ];

  const GroupedRefreshTargets = [".filter-menu-button__footer"];

  const Colors = {
    NO_ANCHOR_BG_COLOR: "#EFEFEF",
  };

  // upgrade table

  function upgradeSoldTable() {
    notify.trigger({
      content: "Table upgraded. Removed listings have a darker background color.",
    });

    const table = document.querySelector(Selectors.SOLD_RESULT_TABLE);
    const tableRows = table.querySelectorAll(Selectors.TABLE_ROW);

    for (const row of tableRows) {
      const anchor = row.querySelector(Selectors.TABLE_ROW_ANCHOR);

      if (!anchor) {
        row.style.backgroundColor = Colors.NO_ANCHOR_BG_COLOR;
      }
    }
  }

  // checks if the table exists before upgrading it.

  async function tryUpgradeSoldTable() {
    const table = await load(
      () => document.querySelector(Selectors.SOLD_RESULT_TABLE),
      "Results table took too long to load. Try again."
    );

    if (table) upgradeSoldTable();
  }

  // event listeners

  function handleClick(event) {
    if (!event.target.disabled) tryUpgradeSoldTable();
  }

  function handleKeydown(event) {
    if (event.key === "Enter") tryUpgradeSoldTable();
  }

  // init the plugin

  async function init() {
    notify.trigger({
      content: "Plugin activated!",
    });

    // handle enter of search input

    const searchBtn = document.querySelector(Selectors.SEARCH);
    searchBtn.addEventListener("keydown", handleKeydown);

    // register click targets that refresh the table

    for (const sel of RefreshTargets) {
      const el = await load(() => document.querySelector(sel));

      if (el) {
        el.addEventListener("click", handleClick);
      }
    }
    for (const groupSel of GroupedRefreshTargets) {
      const els = await load(() => document.querySelectorAll(groupSel));

      if (els && els.length) {
        els.forEach((el) => el.addEventListener("click", handleClick));
      }
    }

    // Check if a table exists on load. If so, upgrade it.

    tryUpgradeSoldTable();
  }

  init();

})();
