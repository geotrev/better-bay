# Super Bay

Tampermonkey scripts to automate chores on ebay.

## Page Features

Bracketed number corresponds to a script under the [Install](#install) section.

- [1] `ebay.com/fdbk/leave_feedback`
  - `Alt+Shift+F`: Auto-fills **all pending feedback** with five star ratings and generic positive messages.

## Install

Available scripts:

- [1] `https://raw.githubusercontent.com/geotrev/super-bay/main/auto-feedback.js`

Steps:

1. Install [tampermonkey for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Copy and paste contents from your script of choice (see above).
3. From the extension icon in the top right of the browser, select `Create a new script...`.
4. In the resulting page, delete the default code/content and paste the previously copied script into the text editor.
5. Go to `File` > `Save`.

### Get Script Updates

You can do this to get new features/bug fixes if desired. If not, skip these steps.

1. Open the script in your tampermonkey dashboard.
2. Select the `Settings` tab on the left-hand tabset.
3. Under `Updates`, paste the url you copied contents from (again, see above).
4. Click the `Check for updates` checkbox.
5. Select `Save`
6. Go to `Settings` on the top right of the tampermonkey dashboard.
7. Under `Externals`, change `Update interval` to `Every Day`.

Now you'll receive the updated script each day.
