import { notify } from "./notify.js"

export async function load(callback, content, tries = 20) {
  let i = -1,
    res = null

  while (++i < tries) {
    await new Promise((done) =>
      setTimeout(() => {
        res = callback()
        done()
      }, 250)
    )

    if (res) return res
  }

  if (content) notify.trigger({ content })
}
