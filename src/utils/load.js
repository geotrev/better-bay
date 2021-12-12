import { notify } from "./notify.js"

export async function load(callback, failMsg, tries = 50) {
  let i = -1,
    res = null

  while (++i < tries) {
    await new Promise((done) =>
      setTimeout(() => {
        res = callback()
        done()
      }, 250)
    )

    if (res) {
      return res
    }
  }

  if (failMsg) {
    notify.trigger({ content: failMsg })
  }
}
