// ==UserScript==
// @name        Super Bay - Research
// @description Better controls in seller hub research
// @namespace   https://github.com/geotrev/super-bay
// @version     1.0.14
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

  const mutationMap = new Map();
  const mutationConfig = {
    attributes: true,
    subtree: true,
    childList: true,
  };

  function subscribeTargets(config, observer) {
    const entry = mutationMap.get(config.selector);

    if (!entry) {
      mutationMap.set(config.selector, config);
      config.elements.forEach((el) => {
        el.dataset.superBaySel = config.selector;
        observer.observe(el, mutationConfig);
        el.addEventListener(config.type, config.handler);
      });
    }
  }

  async function mutationCallback(mutations, observer) {
    let removedTargets = [];

    for (const mutation of mutations) {
      const { target, removedNodes } = mutation;
      if (Array.from(removedNodes).indexOf(target) === -1) continue

      const config = mutationMap.get(target.dataset.superBaySel);

      if (config) {
        config.elements.forEach((el) =>
          el.removeEventListener(config.type, config.handler)
        );

        config.elements.forEach((el) => observer.unobserve(el));
        config.elements = [];

        mutationMap.delete(config.selector);
        removedTargets.push(config);
      }
    }

    // wait for new elements if there were changes that resulted in deletions
    if (removedTargets.length) {
      for (const config of removedTargets) {
        const elements = await load(() => {
          const els = Array.from(document.querySelectorAll(config.selector));
          return els.length ? els : null
        });

        if (elements) {
          config.elements = elements;
          subscribeTargets(config, observer);
        }
      }
    }
  }

  function createEventTargetObserver() {
    const observer = new MutationObserver(mutationCallback);

    // config = {elements, selector, type, handler}
    /**
     * @param {{elements: HTMLElement[], selector: string, type: string, handler: function}}
     */
    function subscribeEventTargets(config = {}) {
      subscribeTargets(config, observer);
    }

    // will probably need this... eventually.
    function unsubscribeEventTargets() {}

    return { subscribeEventTargets, unsubscribeEventTargets }
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

  const { subscribeEventTargets } = createEventTargetObserver();

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

    // wrap event listeners with mutationobserver to auto-replace
    // handler when they're removed via filtering etc.

    // handle enter of search input

    const searchBtn = document.querySelector(Selectors.SEARCH);
    searchBtn.addEventListener("keydown", handleKeydown);

    // register click targets that refresh the table

    for (const selector of RefreshTargets) {
      const element = await load(() => document.querySelector(selector));

      if (element) {
        subscribeEventTargets({
          elements: [element],
          selector,
          type: "click",
          handler: handleClick,
        });
      }
    }

    for (const selector of GroupedRefreshTargets) {
      const elements = await load(() => {
        const els = Array.from(document.querySelectorAll(selector));
        return els.length ? els : null
      });

      if (elements) {
        subscribeEventTargets({
          elements,
          selector,
          type: "click",
          handler: handleClick,
        });
      }
    }

    // Check if a table exists on load. If so, upgrade it.

    tryUpgradeSoldTable();
  }

  init();

})();
