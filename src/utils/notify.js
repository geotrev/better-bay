class Notify {
  constructor() {
    const notifyWrapperTemp = document.createElement("div")
    const notifyElTemp = document.createElement("div")

    notifyWrapperTemp.innerHTML =
      '<div style="position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 48px 16px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>'
    notifyElTemp.innerHTML =
      '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;font-weight: bold;font-size: 12px;">[Super Bay]</h3><p style="font-size: 16px;line-height: 22px;" data-notify-content></p></section>'

    this.notifyWrapper = notifyWrapperTemp.firstElementChild
    this.notifyEl = notifyElTemp.firstElementChild

    document.body.appendChild(this.notifyWrapper)
    this.destroy = this.destroy.bind(this)
  }

  trigger({ content }) {
    const notify = this.notifyEl.cloneNode(true)
    notify.querySelector("p").innerText = content

    this.notifyWrapper.appendChild(notify)
    setTimeout(this.destroy, 2000)
  }

  destroy() {
    this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild)
  }
}

export const notify = new Notify()
