import EventEmitter from 'eventemitter3'

export type SelectorMutationObserverConfig = {
  childList: boolean
  subtree: boolean
}
export type SelectorListOptions = {
  childrenEvent?: boolean
  rewrite?: boolean
}

/**
 * 1. 监听的事件
 * 2. 选择的元素，会传入document.querySelectorAll进行选择
 * 3. 事件出发后的响应回调事件名称
 * 4. 配置项
 */
export type SelectorListItem = [string, string, string, SelectorListOptions?]
export type SelectorList = Array<SelectorListItem>

/**
 * - element: 事件触发的元素
 * - event: 事件名称
 * - select: 选择的元素
 * - e: html元素的事件传参
 */
export type SelectorEvent = {
  element: Element
  event: string
  select: string
  e: any
}
const defaultSelectorListOptions: SelectorListOptions = {
  childrenEvent: false,
  rewrite: false
}

export class SelectorItem {
  private readonly __selector: Selector
  private readonly __element: Element
  private readonly __eventMap: Map<{ select: string, event: string, trigger: string }, (e: any) => void> = new Map()
  private readonly __optionsMap: Map<{ select: string, event: string, trigger: string }, SelectorListOptions> = new Map()

  get element() {
    return this.__element
  }

  get size() {
    return this.__eventMap.size
  }

  constructor(selector: Selector, element: Element) {
    this.__selector = selector
    this.__element = element
  }

  private getKey(select: string, event: string, trigger: string) {
    return { select, event, trigger }
  }

  private createEventCallback(select: string, event: string, trigger: string, option: SelectorListOptions) {
    const callback = (e: any) => {
      if (e.target !== this.__element && !option.childrenEvent) return
      e.preventDefault()
      this.__selector.onEvent(this.__element, event, select, e, trigger)
    }
    return callback
  }

  addEvent(select: string, event: string, trigger: string, option?: SelectorListOptions) {
    option = { ...defaultSelectorListOptions, ...option }
    const key = this.getKey(select, event, trigger)
    if (this.__eventMap.has(key) && !option.rewrite) return
    const callback = this.createEventCallback(select, event, trigger, option)
    this.__element.addEventListener(event, callback)
    if (this.__eventMap.has(key)) {
      this.__element.removeEventListener(event, this.__eventMap.get(key)!)
    }
    this.__eventMap.set(key, callback)
    this.__optionsMap.set(key, option)
  }

  removeEvent(select: string, event: string, trigger: string) {
    const key = this.getKey(select, event, trigger)
    const e = this.__eventMap.get(key)
    if (e) this.__element.removeEventListener(event, e)
  }

  copySelectorItem(element: Element) {
    const selectorItem = new SelectorItem(this.__selector, element)
    Array.from(this.__eventMap.keys()).forEach(k => {
      const options = this.__optionsMap.get(k)
      if (!options) return
      selectorItem.addEvent(k.select, k.event, k.trigger, options)
    })
    return selectorItem
  }

  destroy() {
    Array.from(this.__eventMap.entries()).forEach(([k, e]) => {
      try {
        this.__element.removeEventListener(k.event, e)
      } catch (e) {
        console.warn(e)
      }
    })
    this.__eventMap.clear()
    this.__optionsMap.clear()
  }
}

/**
 * 标识符由 select + event + trigger 组成
 */
export class Selector extends EventEmitter<Record<string, [{ element: Element, event: string, select: string, e: any }]>> {
  private __selector2Options: Map<{ select: string, event: string, trigger: string }, SelectorListOptions> = new Map()
  private __selector2Elements: Map<{ select: string, event: string, trigger: string }, Set<Element>> = new Map()
  private __element2SelectorItem: Map<Element, SelectorItem> = new Map()

  private __destroyed: boolean = false

  private readonly __root: Element
  private readonly __observer: MutationObserver
  private readonly __config: SelectorMutationObserverConfig

  constructor(selectList?: SelectorList, root?: Element, config?: SelectorMutationObserverConfig) {
    super()
    const MutationObserver =
        window.MutationObserver ||
        (window as any).WebKitMutationObserver ||
        (window as any).MozMutationObserver

    this.__root = root || document.body

    this.__observer = new MutationObserver((mutationsList, observer) => {
      this.refresh()
    })

    this.__config = { childList: true, subtree: true, ...config }

    this.__observer.observe(this.__root, this.__config)

    this.addSelectorList(selectList || [])

    this.refresh()
  }

  /**
     * SelectorItem实例触发后的回调函数
     *
     * @param {HTMLElement} element html元素
     * @param {String} event 事件触发名字
     * @param {String} select querySelectorAll对应的选择方法
     * @param {Object} e 事件获取的事件对象
     * @param {String} trigger 触发器名字
     */
  onEvent(element: Element, event: string, select: string, e: any, trigger: string) {
    const data: SelectorEvent = { element, event, select, e }
    this.emit(trigger, data)
  }

  private getKey(select: string, event: string, trigger: string) {
    return { select, event, trigger }
  }

  addSelectorList(selectList: SelectorList) {
    selectList.forEach(item => {
      const [event, select, trigger, options_] = item
      const options = { ...defaultSelectorListOptions, ...options_ }
      const key = this.getKey(select, event, trigger)
      if (this.__selector2Options.has(key) && !options.rewrite) return
      this.__selector2Options.set(key, options)
    })
    this.refresh()
  }

  removeSelectorList(selectList: SelectorList) {
    selectList.forEach(item => {
      const [event, select, trigger] = item
      const key = this.getKey(select, event, trigger)
      const elements = this.__selector2Elements.get(key)
      if (!elements) return
      new Set(elements).forEach(element => {
        const si = this.__element2SelectorItem.get(element)
        si?.removeEvent(select, event, trigger)
        if (si?.size === 0) {
          elements.delete(element)
          si.destroy()
          this.__element2SelectorItem.delete(element)
        }
      })
      this.__selector2Elements.delete(key)
      this.__selector2Options.delete(key)
    })
    this.refresh()
  }

  private select() {
    setTimeout(() => {
      const kvList = Array.from(this.__selector2Options.entries())
      kvList.forEach(([selector, options]) => {
        const displayElements = Array.from(document.querySelectorAll(selector.select))
        const selectedElements = new Set(this.__selector2Elements.get(selector)) || new Set()
        displayElements.forEach(dElement => {
          if (selectedElements.has(dElement)) {
            if (options.rewrite) {
              this.__element2SelectorItem.get(dElement)?.addEvent(selector.select, selector.event, selector.trigger, options)
            }
            selectedElements.delete(dElement)
            return
          }
          const selectorItem = new SelectorItem(this, dElement)
          selectorItem.addEvent(selector.select, selector.event, selector.trigger, options)
          this.__element2SelectorItem.set(dElement, selectorItem)
        })
        selectedElements.forEach(sElement => {
          this.__element2SelectorItem.get(sElement)?.destroy()
          this.__element2SelectorItem.delete(sElement)
        })
        this.__selector2Elements.set(selector, new Set(displayElements))
      })
    }, 0)
  }

  private refresh() {
    this.select()
  }

  destroy() {
    if (this.__destroyed) return
    this.__destroyed = true
    Array.from(this.__element2SelectorItem.values()).forEach(selectorItem => {
      selectorItem.destroy()
    })
    this.__observer.disconnect()
    this.__element2SelectorItem.clear()
    this.__selector2Options.clear()
    this.__selector2Elements.clear()
    this.removeAllListeners()
  }
}
