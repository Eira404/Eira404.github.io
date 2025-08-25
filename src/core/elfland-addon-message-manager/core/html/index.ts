import { ElflandAddon } from '@/core/elfland/core/addon-base'
import type { MessageDictHTML } from '../../types'
import type { Elfland } from '@/core/elfland/core'
import type { Selector, SelectorList } from '@/core/elfland/utils'

export class HTMLMessageManager extends ElflandAddon {
  private readonly __selector: Selector
  private readonly __key2message: Map<string, MessageDictHTML> = new Map()

  constructor(elfland: Elfland) {
    super(elfland)

    this.__selector = elfland.selector
  }

  loadedCallback(): void {
    this.__selector.on('htmlMessage', (e) => {
      console.log('htmlMessage', e)
    })
  }

  private createSelectorDataList(message: MessageDictHTML) {
    const selectorDataList: SelectorList = []
    Object.entries(message).forEach(([e, d]) => {
      d.forEach(m => {
        selectorDataList.push([e, m[0], 'htmlMessage', { childrenEvent: true }])
      })
    })
    return selectorDataList
  }

  addMessage(key: string, message: MessageDictHTML) {
    this.removeMessage(key)
    this.__key2message.set(key, message)
    this.__selector.addSelectorList(this.createSelectorDataList(message))
  }

  removeMessage(key: string) {
    const message = this.__key2message.get(key)
    if (!message) return
    this.__selector.removeSelectorList(this.createSelectorDataList(message))
  }
}
