import { ElflandAddon } from '@/core/elfland/core/addon-base'
import { computed, ref, type Ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { Friend } from './friend'
import type { Elfland } from '@/core/elfland/core'

export class Friends extends ElflandAddon {
  private __friendsIsGotten: boolean = false
  private __friends: Ref<Friend[]> = ref([])

  get friends() {
    return computed(() => this.__friends.value)
  }

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
    if (this.__friendsIsGotten) return
    try {
      await this.__elfland.data.waitingDataGet
      const data = this.__elfland.data.data
      if (data === null) return
      const friends = data.friends
      friends.forEach(f => {
        this.__friends.value.push(new Friend(f.name, f.url, f.avater, f.desc))
      })
      this.__friendsIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }
}
