// import EventEmitter from 'eventemitter3'

// export type SelectorMutationObserverConfig = {
//   childList: boolean
//   subtree: boolean
// }
// export type SelectorListOptions = {
//   childrenEvent: boolean
//   rewrite: boolean
// }

// /**
//  * 1. 监听的事件
//  * 2. 选择的元素，会传入document.querySelectorAll进行选择
//  * 3. 事件出发后的响应回调事件名称
//  * 4. 配置项
//  */
// export type SelectorListItem = [string, string, string, SelectorListOptions?]
// export type SelectorList = Array<SelectorListItem>

// /**
//  * - element: 事件触发的元素
//  * - event: 事件名称
//  * - select: 选择的元素
//  * - e: html元素的事件传参
//  */
// export type SelectorEvent = {
//   element: Element
//   event: string
//   select: string
//   e: any
// }
// const defaultSelectorListOptions: SelectorListOptions = {
//   childrenEvent: false,
//   rewrite: false
// }

// class SelectorElement {
//   private readonly __selector: Selector
//   private readonly __element: Element
//   private readonly __eventMap: Map<{ select: string, event: string, trigger: string }, (e: any) => void> = new Map()

//   get element() {
//     return this.__element
//   }

//   constructor(selector: Selector, element: Element) {
//     this.__selector = selector
//     this.__element = element
//   }

//   private getKey(select: string, event: string, trigger: string) {
//     return { select, event, trigger }
//   }

//   addEvent(select: string, event: string, trigger: string, option?: SelectorListOptions) {
//     option = option || defaultSelectorListOptions
//     const key = this.getKey(select, event, trigger)
//     if (this.__eventMap.has(key) && !option.rewrite) return
//     const callback = this.createEventCallback(select, event, trigger, option)
//     this.__eventMap.set(key, callback)
//   }

//   removeEvent(select: string, event: string, trigger: string) {
//     const key = this.getKey(select, event, trigger)
//     const e = this.__eventMap.get(key)
//     if (e) this.__element.removeEventListener(event, e)
//   }

//   private createEventCallback(select: string, event: string, trigger: string, option: SelectorListOptions) {
//     const callback = (e: any) => {
//       if (e.target !== this.__element && !option.childrenEvent) return
//       e.preventDefault()
//       this.__selector.onEvent(this.__element, event, select, e, trigger)
//     }
//     return callback
//   }

//   destroy() {
//     Array.from(this.__eventMap.entries()).forEach(([k, e]) => {
//       try {
//         this.__element.removeEventListener(k.event, e)
//       } catch (e) {
//         console.warn(e)
//       }
//     })
//   }
// }

// export class Selector extends EventEmitter {
//   private readonly __root: Element
//   private readonly __elementToSelectorElement: Map<Element, SelectorElement> = new Map()
//   private readonly __selectorSet: Set<string> = new Set()
//   private readonly __observer: MutationObserver
//   private readonly __config: SelectorMutationObserverConfig
//   private __selectList: SelectorList
//   private __destroyed: boolean = false
//   constructor(selectList?: SelectorList, root?: Element, config?: SelectorMutationObserverConfig) {
//     super()
//     const MutationObserver =
//       window.MutationObserver ||
//       (window as any).WebKitMutationObserver ||
//       (window as any).MozMutationObserver

//     this.__root = root || document.body

//     this.__observer = new MutationObserver((mutationsList, observer) => {
//       this.reselect(false)
//     })

//     this.__config = config || { childList: true, subtree: true }

//     this.__observer.observe(this.__root, this.__config)

//     this.__selectList = selectList || []
//     this.addSelectList(selectList || [])
//   }

//   destroy() {
//     if (this.__destroyed) return
//     this.__destroyed = true
//     const selectorElements = Array.from(this.__elementToSelectorElement.values())
//     selectorElements.forEach(s => { s.destroy() })
//     this.__observer.disconnect()
//     this.__elementToSelectorElement.clear()
//     this.__selectorSet.clear()
//     this.removeAllListeners()
//   }

//   private mergeSelectList(selectList: SelectorList, add: boolean) {
//     selectList.forEach(s => {
//       if (add) {
//         if (this.__selectList.findIndex((val) => val[0] === s[0] && val[1] === s[1] && val[2] === s[2]) !== -1) {
//           /** 存在相同的数据 */
//           if (s[3]?.rewrite) {
//             /** 重写 */

//           }
//         }
//       }
//     })
//   }

//   addSelectList(selectList: SelectorList) {
//     setTimeout(() => {
//       const selectors = selectList.map(s => s[1])
//       selectors.forEach(s => { this.__selectorSet.add(s) })
//       this.selectElement(selectors)
//       selectList.forEach(item => {
//         const event = item[0]
//         const select = item[1]
//         const trigger = item[2]
//         const options = item[3]
//         const elements = Array.from(document.querySelectorAll(select))
//         elements.forEach(element => {
//           if (!this.__elementToSelectorElement.has(element)) this.__elementToSelectorElement.set(element, new SelectorElement(this, element))
//           const selectorElement = this.__elementToSelectorElement.get(element)!
//           selectorElement.addEvent(select, event, trigger, options)
//         })
//       })
//     }, 0)
//   }

//   removeSelectList(selectList: SelectorList) {
//     setTimeout(() => {
//       selectList.forEach((item) => {
//         const event = item[0]
//         const select = item[1]
//         const trigger = item[2]
//         const elements = Array.from(document.querySelectorAll(select))
//         elements.forEach(element => {
//           if (!this.__selectors.has(element)) this.__selectors.set(element, new SelectorElement(this, element))
//           const selectorElement = this.__selectors.get(element)!
//           selectorElement.removeEvent(select, event, trigger)
//         })
//       })
//     }, 0)
//   }

//   private selectElement(selectors_?: string[]) {
//     const selectors = Array.from(selectors_ ? new Set(selectors_) : this.__selectorSet.values())
//     const displayedElements = new Set(this.__elementToSelectorElement.keys())
//     const selectedElements = new Set(selectors.map(select => Array.from(document.querySelectorAll(select))).flat(2))
//     selectedElements.forEach(element => {
//       if (displayedElements.has(element)) {
//         displayedElements.delete(element)
//       } else {
//         this.__elementToSelectorElement.set(element, new SelectorElement(this, element))
//       }
//     })
//     /** 输入selectors_时候，只允许增加元素 */
//     if (selectors_) return
//     displayedElements.forEach(element => {
//       this.__elementToSelectorElement.get(element)?.destroy()
//       this.__elementToSelectorElement.delete(element)
//     })
//   }
// }
import EventEmitter from 'eventemitter3'

export type SelectorMutationObserverConfig = {
  childList: boolean
  subtree: boolean
}
export type SelectorListOptions = {
  childrenEvent: boolean
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
  childrenEvent: false
}

class SelectorItem extends EventEmitter {
  selector: Selector
  element: Element
  select: string
  event: string
  trigger: string
  option: SelectorListOptions
  onEvent_: (e: any) => void
  constructor(
    selector: Selector,
    element: Element,
    select: string,
    event: string,
    trigger: string,
    option?: SelectorListOptions
  ) {
    super()
    /**
     * 选择器实例
     */
    this.selector = selector

    /**
     * 选定的标签
     */
    this.element = element

    /**
     * 选定该标签使用的querySelectorAll语句
     */
    this.select = select

    /**
     * 需要绑定的事件
     */
    this.event = event

    /**
     * 事件触发后，回调需要触发的事件
     */
    this.trigger = trigger

    /**
     * 配置项
     * ```js
     * const option = {
     *   childrenEvent: false, // 如果事件从子元素冒泡，是否接收(false：不接收)
     * }
     * ```
     */
    this.option = option || defaultSelectorListOptions

    this.onEvent_ = this.onEvent.bind(this)

    this.element.addEventListener(this.event, this.onEvent_)
  }

  onEvent(e: any) {
    if (e.target !== this.element && !this.option.childrenEvent) return
    e.preventDefault()
    this.selector.onEvent(this.element, this.event, this.select, e, this.trigger)
  }

  destroy() {
    this.element.removeEventListener(this.event, this.onEvent_)
  }
}

export default class Selector extends EventEmitter {
  selectList: SelectorList
  root: Element

  /**
   * 校验
   * 防止reselect事件回调触发
   */
  destroyed: boolean = false
  map: Map<Element, Array<SelectorItem>>
  observer: MutationObserver
  config: SelectorMutationObserverConfig

  constructor(selectList: SelectorList, root?: Element, config?: SelectorMutationObserverConfig) {
    super()
    const MutationObserver =
      window.MutationObserver ||
      (window as any).WebKitMutationObserver ||
      (window as any).MozMutationObserver

    /**
     * 选择列表
     * ```js
     * const selectList = [
     *   // event, querySelectorAll(...), trigger event name, opt
     *   ['click', '#app', 'clickApp'],
     *   ['mouseenter', 'a', 'enterA', { childrenEvent: false }]
     * ]
     * ```
     */
    this.selectList = selectList || []

    /**
     * 监视变化的根元素
     */
    this.root = root || document.body

    /**
     * 标签与SelectorItem图
     *
     * - key: element
     * - value: [selectorItem1, selectorItem2, ...]
     */
    this.map = new Map()

    /**
     * MutationObserver观察者
     */
    this.observer = new MutationObserver((mutationsList, observer) => {
      this.reselect(false)
    })

    /**
     * MutationObserver观察配置项
     */
    this.config = config || { childList: true, subtree: true }

    /**
     * 开始观察
     */
    this.observer.observe(this.root, this.config)

    /**
     * 初始化标签选择
     */
    this.select()
  }

  /**
   * 更新选择列表，并重新选择
   * @param {Array} selectList 选择列表
   */
  updateSelectList(selectList: SelectorList) {
    this.selectList = selectList
    this.reselect(true)
  }

  /**
   * 销毁选择器实例
   */
  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    const selectorItemLists = Array.from(this.map.values())
    selectorItemLists.forEach((selectorItemList) => {
      selectorItemList.forEach((selectorItem) => {
        selectorItem.destroy()
      })
    })
    this.observer.disconnect()
    this.map.clear()
    this.removeAllListeners()
  }

  /**
   * 选择标签
   */
  select() {
    setTimeout(() => {
      if (this.destroyed) return
      this.selectList.forEach((item) => {
        const event = item[0]
        const select = item[1]
        const trigger = item[2]
        const options = item[3]
        const elements = Array.from(document.querySelectorAll(select))
        elements.forEach((element) => {
          const selectorItem = new SelectorItem(this, element, select, event, trigger, options)
          if (!this.map.has(element)) this.map.set(element, [])
          this.map.get(element)?.push(selectorItem)
        })
      })
    }, 0)
  }

  /**
   * 重新选择
   */
  reselect(force = false) {
    setTimeout(() => {
      if (this.destroyed) {
        return
      }
      if (force === true) {
        const selectorItemLists = Array.from(this.map.values())
        selectorItemLists.forEach((selectorItemList) => {
          selectorItemList.forEach((selectorItem) => {
            selectorItem.destroy()
          })
        })
        this.map.clear()
      }
      const tempMap = new Map()
      const visitedElements = new Set()
      this.selectList.forEach((item) => {
        const event = item[0]
        const select = item[1]
        const trigger = item[2]
        const elements = Array.from(document.querySelectorAll(select))
        elements.forEach((element) => {
          // 文档中存在该元素
          //
          visitedElements.add(element)
          // 如果map中存在该元素 直接忽略
          // 这样会导致reselect过程不能增加event
          // 新增事件 需要force为true
          //
          if (this.map.has(element)) return
          const selectorItem = new SelectorItem(this, element, select, event, trigger)
          if (!tempMap.has(element)) tempMap.set(element, [])
          tempMap.get(element).push(selectorItem)
        })
      })
      // 由于tempMap和map键不会有冲突
      // 直接合并
      //
      this.map = new Map([...this.map, ...tempMap])
      const elements = Array.from(this.map.keys())
      elements.forEach((element) => {
        if (!document.contains(element) || !visitedElements.has(element)) {
          // dom中不存在的
          // 元素没有被遍历过的（dom中存在，但是没有被select）（但是好像不会出现这个情况，触发直接改selectList然后reselect(false)）
          //
          const selectorItemList = this.map.get(element) || []
          selectorItemList.forEach((selectorItem) => {
            selectorItem.destroy()
          })
          this.map.delete(element)
        }
      })
    }, 0)
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
}
