import { load } from "./load.js"

/**
 * Creates a new MutationObserver instance to watch
 * a set of nodes, subscribing them to a handler. If
 * the node(s) are removed from the dom at any point,
 * the observer strips the subscribed elements
 * from itself and requeries and subscribes them
 * to the handler.
 *
 * The observer doesn't care if one or all elements in
 * the provided config are removed. It's assumed
 * all are removed and attempts to rebuild the event
 * handler.
 */
export function createEventTargetObserver() {
  const handlerMap = new Map()
  const mutationConfig = {
    attributes: true,
    subtree: true,
    childList: true,
  }

  function subscribeTargets(config, observer) {
    const entry = handlerMap.get(config.sel)

    if (!entry) {
      handlerMap.set(config.sel, config)
      config.elements.forEach((el) => {
        el.dataset.superBaySel = config.sel
        observer.observe(el, mutationConfig)
        el.addEventListener(config.type, config.handler)
      })
    }
  }

  async function mutationCallback(mutations, observer) {
    let changed = []

    for (const mutation of mutations) {
      const { target, removedNodes } = mutation
      if (Array.from(removedNodes).indexOf(target) === -1) continue

      const config = handlerMap.get(target.dataset.superBaySel)

      if (config) {
        config.elements.forEach((el) =>
          el.removeEventListener(config.type, config.handler)
        )

        config.elements.forEach((el) => observer.unobserve(el))
        config.elements = []

        handlerMap.delete(config.sel)
        changed.push(config)
      }
    }

    // wait for new elements if there were changes that resulted in deletions
    if (changed.length) {
      for (const config of changed) {
        const elements = await load(() => document.querySelectorAll(config.sel))

        if (elements.length) {
          config.elements = elements
          subscribeTargets(config, observer)
        }
      }
    }
  }

  const observer = new MutationObserver(mutationCallback)

  // config = {elements, sel, type, handler}
  function subscribeEventTargets(config = {}) {
    subscribeTargets(config, observer)
  }

  // will probably need this... eventually.
  function unsubscribeEventTargets() {}

  return { subscribeEventTargets, unsubscribeEventTargets }
}
