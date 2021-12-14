# Better Bay

Tampermonkey scripts to automate chores and generally improve the experience of ebay.

## Install

Add the [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) extension to Chrome.

1. [Install Better Bay – Feedback](https://github.com/geotrev/better-bay/raw/main/dist/feedback.user.js).
2. [Install Better Bay – Research](https://github.com/geotrev/better-bay/raw/main/dist/research.user.js).

### Feedback Shortcuts

| Key Command                                                                                  | Page                   | Description                                                      |
| -------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| <kbd>⌥</kbd>/<kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>F</kbd>                                | `/fdbk/leave_feedback` | Automatically fill out visible feedback items.                   |
| <kbd>^</kbd>/<kbd>ctrl</kbd> + <kbd>⌥</kbd>/<kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>F</kbd> | `/fdbk/leave_feedback` | Automatically fill out visible feedback items, but don't submit. |

### Research Tab (Seller's Hub) Shortcuts

None.

### Development

If you wish to contribute, branch from `develop` and make PRs against it.

**Install development version:**

1. [Install Development Better Bay – Feedback](https://github.com/geotrev/better-bay/raw/develop/dist/feedback-development.user.js).
2. [Install Development Better Bay – Research](https://github.com/geotrev/better-bay/raw/develop/dist/research-development.user.js).

Install via the above links to use the latest features before they hit mainstream.

**How to build prerelease versions and test in tampermonkey:**

These are one-time-only steps to develop your forked changes via the tampermonkey extension.

1. Fork the repo and clone it locally.
2. Set the `development` field in `meta-versions.json` to your target [prerelease version](#versioning).
3. Commit the changes and push.
4. Copy the development install links above, paste them in your browser url, but update them to use your gh username before submitting. E.g., `geotrev/better-bay/...` to `<your-gh-user>/better-bay/...`.
5. Tampermonkey will ask to install your script. Verify the updateURL and downloadURL fields are correct, then install.

Now, anytime you update the `development` field in `meta-versions.json`, you can trigger an update in your tampermonkey dashboard and receive the update.

_NOTE: The `meta-branch.json` file will be reverted back to `develop` right before merging to the `develop` branch._

## Versioning

This repo uses semantic versioning for its scripts.

When developing in this repo, always set the `development` version (in `meta-versions.json`) to be later than the `main` version. E.g., if `main` is `1.1.0` and your changes create an API-breaking change, set the version to `2.0.0-beta.0`, a new feature/script to `1.2.0-beta.0`, and a bug fix to `1.1.1-beta.0`.
