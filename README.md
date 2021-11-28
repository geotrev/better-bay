# Super Bay

A tampermonkey script to automate chores in ebay.

Currently, this script adds the following key bindings:

- `ebay.com/fdbk/leave_feedback`
  - `ALT+SHIFT+F`: Auto-fills **all pending feedback** with five star ratings and generic positive messages.

## Install

1. Install [tampermonkey for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Copy and paste contents from [here](https://raw.githubusercontent.com/geotrev/super-bay/main/super-bay.js).
3. From the extension icon in the top right of the browser, select `Create a new script...`.
4. In the resulting page, delete the default code/content and paste the previously copied script into the text editor.
5. Go to `File` > `Save`.

### Additional Options

You can configure the script to automatically update if desired:

1. Open the script in your tampermonkey dashboard.
2. Select the `Settings` tab on the left-hand tabset.
3. Under `Updates`, paste this url: `https://raw.githubusercontent.com/geotrev/super-bay/main/super-bay.js`
4. Click the `Check for updates` checkbox.
5. Select `Save`
6. Go to `Settings` on the top right of the tampermonkey dashboard.
7. Under `Externals`, change `Update interval` to `Every Day`.

Now you'll receive the updated script each day.
