import type { AboutData } from '@/core/elfland-addon-data/types/about'
import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import type { ElflandLangs } from '@/core/elfland/types'
import { computed, reactive, type Reactive } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { AboutItem } from './about'

export class About extends ElflandAddon {
  private __aboutIsGotten: boolean = false
  private __abouts: Reactive<Map<ElflandLangs, AboutItem>> = reactive(new Map())
  private __lang = computed(() => this.__elfland.i18n.getLang().value)

  readonly name = computed(() => this.__abouts.get(this.__lang.value)?.name || '')
  readonly position = computed(() => this.__abouts.get(this.__lang.value)?.position || '')
  readonly avater = computed(() => this.__abouts.get(this.__lang.value)?.avater || '')
  readonly about = computed(() => this.__abouts.get(this.__lang.value)?.about || [])
  readonly github = computed(() => this.__abouts.get(this.__lang.value)?.github || '')

  readonly links = computed(() => this.__abouts.get(this.__lang.value)?.links || [])
  readonly skills = computed(() => this.__abouts.get(this.__lang.value)?.skills || [])

  constructor(elfland: Elfland) {
    super(elfland)
  }

  loadedCallback(): void {
    this.__elfland.routerPromise.addCheck(this.check, this)
  }

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (this.__aboutIsGotten) return
    try {
      await this.__elfland.data.waitingDataGet
      const data = this.__elfland.data.data
      if (data === null) return
      const about = data.about
      this.__elfland.i18n.langList.forEach(l => {
        if (about[l] === undefined) return
        this.createAboutItem(l, about[l])
      })

      this.__aboutIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }

  private createAboutItem(lang: ElflandLangs, about: AboutData) {
    this.__abouts.set(lang, new AboutItem(about))
  }
}
