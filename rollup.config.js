import metablock from "rollup-plugin-userscript-metablock"
import { terser } from "rollup-plugin-terser"

export default {
  input: "src/feedback/index.js",
  output: {
    file: "dist/feedback.user.js",
    format: "iife",
    generatedCode: {
      compact: true,
    },
  },
  plugins: [
    metablock({
      file: "./meta.json",
      override: {
        name: "Super Bay - Feedback",
        description: "Automate feedback on ebay",
        match: "https://www.ebay.com/fdbk/leave_feedback*",
        downloadURL:
          "https://github.com/geotrev/super-bay/raw/main/feedback.user.js",
        updateURL:
          "https://github.com/geotrev/super-bay/raw/main/feedback.user.js",
      },
    }),
    terser({
      mangle: true,
      format: {
        comments: function (_, comment) {
          var text = comment.value
          var type = comment.type
          if (type == "comment1") {
            return /@[a-zA-Z]|UserScript/i.test(text)
          }
        },
      },
    }),
  ],
}
