import { ElflandAddon } from '@/core/elfland/core/addon-base'
import { HTMLMessageManager } from './html'
import type { Elfland } from '@/core/elfland/core'

export class MessageManager extends ElflandAddon {
  readonly html: HTMLMessageManager

  constructor(elfland: Elfland) {
    super(elfland)
    this.html = new HTMLMessageManager(elfland)
  }

  loadedCallback(): void {}
}
