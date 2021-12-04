import metablock from "rollup-plugin-userscript-metablock"
import { terser } from "rollup-plugin-terser"
import glob from "glob"
import path from "path"
import fs from "fs"

const scriptSources = glob.sync(path.resolve("src/!(utils)"))

/**
 * Generates an array of rollup configs with a shallow iterationthrough src/
 *
 * - config.input is always src\/*\/index.js
 * - config.output.file is always dist/<src_dir_name>.user.js
 * - override to meta block is derived from src\/*\/meta.json
 */

export default scriptSources.map((sourcePath) => {
  const pathParts = sourcePath.split("/")
  const file = path.resolve(`dist/${pathParts[pathParts.length - 1]}.user.js`)
  const input = `${sourcePath}/index.js`

  const metaPath = `${sourcePath}/meta.json`
  const override = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
    : undefined

  return {
    input,
    output: {
      file,
      format: "iife",
      generatedCode: { compact: true },
    },
    plugins: [
      metablock({ file: path.resolve("./meta.json"), override }),
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
