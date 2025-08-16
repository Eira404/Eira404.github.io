import type { LinkDataItem, SkillDataItem } from '@/core/elfland-addon-data/types/about'
import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import { reactive, ref, type Reactive, type Ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

export class About extends ElflandAddon {
  private __aboutIsGotten: boolean = false

  readonly name: Ref<string> = ref('')
  readonly position: Ref<string> = ref('')
  readonly avater: Ref<string> = ref('')
  readonly about: Reactive<string[]> = reactive([])
  readonly github: Ref<string> = ref('')

  readonly links: Reactive<LinkDataItem[]> = reactive([])
  readonly skills: Reactive<SkillDataItem[]> = reactive([])

  constructor(elfland: Elfland) {
    super(elfland)

    elfland.routerPromise.addCheck(this.check, this)
  }

  logoutCallback(): void {}

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
      this.name.value = about.name
      this.position.value = about.position
      this.avater.value = about.avater
      about.about.forEach(a => {
        this.about.push(a)
      })
      this.github.value = about.github
      about.links.forEach(l => {
        this.links.push(l)
      })
      about.skills.forEach(s => {
        this.skills.push(s)
      })

      this.__aboutIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }
}
