import { notify } from "./notify.js"

/**
 * Repeatedly checks a callback until it returns a truthy value.
 *
 * @param {Function} callback - callback to resolve.
 * @param {string} failMsg - message that is output if the resolver fails.
 * @param {{tries, interval}} timing - the number of tries and the interval between tries.
 */
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
