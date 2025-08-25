import type { Elfland } from '../elfland/core'
import { ref, watch } from 'vue'
import { localGet, localSet } from '../elfland/utils'
import { ElflandAddon } from '../elfland/core/addon-base'

export type ElflandTheme = 'light' | 'dark'

export class Theme extends ElflandAddon {
  static readonly KEY = 'THEME'
  readonly theme = ref<ElflandTheme>('light')

  constructor(elfland: Elfland) {
    super(elfland)

    let t = localGet(Theme.KEY, 'light')
    t = t === 'light' ? 'light' : 'dark'
    localSet('THEME', t)
    this.theme.value = t as ElflandTheme
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
      this.__elfland.emit('theme-change', 'dark')
    }

    watch(this.theme, (newValue) => {
      newValue = newValue === 'light' ? 'light' : 'dark'
      this.__elfland.emit('theme-change', newValue)
      if (newValue === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localSet(Theme.KEY, newValue)
    })
  }

  toggle() {
    this.theme.value = this.theme.value === 'light' ? 'dark' : 'light'
  }

  loadedCallback(): void {}
}
