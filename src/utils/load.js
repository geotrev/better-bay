import { notify } from "./notify.js"

export async function load(callback, failMsg, timing = {}) {
  const tries = timing.tries || 50
  const interval = timing.interval || 100
  const defaultFailMsg =
    "Unable to resolve value after," + String(tries * interval) + "ms."

  return new Promise((resolve, reject) => {
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
