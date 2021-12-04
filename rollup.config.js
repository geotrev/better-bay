import metablock from "rollup-plugin-userscript-metablock"
import { terser } from "rollup-plugin-terser"
import glob from "glob"
import path from "path"
import fs from "fs"
import pkg from "./package.json"

const scriptSources = glob.sync(path.resolve("src/!(utils)"))

function getScriptUrl(name) {
  return `${pkg.repository.url.slice(4, -4)}/raw/main/dist/${name}.user.js`
}

/**
 * Generates an array of rollup configs with a shallow iterationthrough src/
 *
 * - config.input is always src\/*\/index.js
 * - config.output.file is always dist/<src_dir_name>.user.js
 * - override to meta block is derived from src\/*\/meta.json
 */

export default scriptSources.map((sourcePath) => {
  const pathParts = sourcePath.split("/")
  const name = pathParts[pathParts.length - 1]
  const file = path.resolve(`dist/${name}.user.js`)
  const input = `${sourcePath}/index.js`

  const metaPath = `${sourcePath}/meta.json`
  const metaOverride = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
    : undefined

  const scriptUrl = getScriptUrl(name)

  return {
    input,
    output: {
      file,
      format: "iife",
      generatedCode: { compact: true },
    },
    plugins: [
      metablock({
        file: path.resolve("./meta.json"),
        override: {
          ...metaOverride,
          downloadURL: scriptUrl,
          updateURL: scriptUrl,
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
})
