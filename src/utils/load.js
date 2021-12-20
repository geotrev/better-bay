import { notify } from "./notify.js"

export async function load(callback, failMsg, timing) {
  const { tries = 50, interval = 100 } = timing
  const defaultFailMsg =
    "Unable to resolve value after," + String(tries * interval) + "ms."

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
