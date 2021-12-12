export const PluginConfig = {
  DEBUG: false,
  SALE_FEEDBACK_TEXT: "Great buyer + fast payment. Thanks.",
  PURCHASE_FEEDBACK_TEXT: "Easy purchase + item arrived as described. Thanks.",
}

export const StaticTargetSelectors = {
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
}

export const Messages = {
  NO_FEEDBACK: "No feedback, exiting.",
  FILLING_FEEDBACK: "Filling feedback...",
  HOW_TO:
    "Plugin activated! Press Alt+Shift+F to fill and submit all feedback, or Ctrl+Alt+Shift+F to fill (but not submit) feedback.",
}
