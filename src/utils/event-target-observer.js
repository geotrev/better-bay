import { load } from "./load.js"

const mutationMap = new Map()
const mutationConfig = {
  attributes: true,
  subtree: true,
  childList: true,
}

function subscribeTargets(config, observer) {
  const entry = mutationMap.get(config.selector)

  if (!entry) {
    mutationMap.set(config.selector, config)
    config.elements.forEach((el) => {
      el.dataset.superBaySel = config.selector
      observer.observe(el, mutationConfig)
      el.addEventListener(config.type, config.handler)
    })
  }
}

async function mutationCallback(mutations, observer) {
  let removedTargets = []

  for (const mutation of mutations) {
    const { target, removedNodes } = mutation
    if (Array.from(removedNodes).indexOf(target) === -1) continue

    const config = mutationMap.get(target.dataset.superBaySel)

    if (config) {
      config.elements.forEach((el) =>
        el.removeEventListener(config.type, config.handler)
      )

      config.elements.forEach((el) => observer.unobserve(el))
      config.elements = []

      mutationMap.delete(config.selector)
      removedTargets.push(config)
    }
  }

  // wait for new elements if there were changes that resulted in deletions
  if (removedTargets.length) {
    for (const config of removedTargets) {
      const elements = await load(() => {
        const els = Array.from(document.querySelectorAll(config.selector))
        return els.length ? els : null
      })

      if (elements) {
        config.elements = elements
        subscribeTargets(config, observer)
      }
    }
  }
}

export function createEventTargetObserver() {
  const observer = new MutationObserver(mutationCallback)

  // config = {elements, selector, type, handler}
  /**
   * @param {{elements: HTMLElement[], selector: string, type: string, handler: function}}
   */
  function subscribeEventTargets(config = {}) {
    subscribeTargets(config, observer)
  }

  // will probably need this... eventually.
  function unsubscribeEventTargets() {}

  return { subscribeEventTargets, unsubscribeEventTargets }
}
