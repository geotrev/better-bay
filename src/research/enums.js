export const StaticTargetSelectors = {
  SOLD_RESULT_TABLE: ".sold-result-table",
  SEARCH_INPUT: ".research-container input",
  SEARCH_DROPDOWN: ".search-input-panel__dropdown",
  SEARCH_SUBMIT_BTN: ".search-input-panel__research-button",
  TABLE_ROW: ".research-table-row",
  TABLE_ROW_ANCHOR: ".research-table-row__link-row-anchor",
}

export const DynamicTargetSelectors = [
  ".tabs__items",
  ".category-selection-panel .filter-menu-button__items",
  ".category-selection-panel .filter-menu-button__footer",
]

export const GroupedDynamicTargetSelectors = [
  ".filters-panel .filter-menu-button__footer",
  ".search-filter-pills .filter-pill__close",
]

export const Colors = {
  NO_ANCHOR_BG_COLOR: "#EFEFEF",
}

export const Messages = {
  PLUGIN_ACTIVATED: "Plugin activated!",
  TABLE_UPGRADED:
    "Table upgraded. Removed listings have a darker background color.",
  TABLE_UPGRADE_FAILED: "Results table took too long to load. Try again.",
}
