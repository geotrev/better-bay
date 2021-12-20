import { notify } from "./notify.js"

export async function load(callback, failMsg, { tries = 50, interval = 100 }) {
  const defaultFailMsg =
    "Unable to resolve value after " + tries * interval + "ms."

  return await new Promise((resolve, reject) => {
    let i
    const int = setInterval(() => {
      const value = callback()
      if (value) {
        clearInterval(int)
        resolve(value)
      }

      if (++i === tries) {
        clearInterval(int)
        if (failMsg) {
          notify({ content: failMsg || defaultFailMsg })
        }
        reject()
      }
    }, interval)
  })
}
