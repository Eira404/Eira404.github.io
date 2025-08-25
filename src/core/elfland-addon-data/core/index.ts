import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import { DefPromiseHelper } from '@/core/elfland/core/promise-helper'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import type { DataResJson } from '../types'

export class Data extends ElflandAddon {
  private __dataIsGotten: boolean = false
  private __dataPromise: DefPromiseHelper = new DefPromiseHelper()
  private __data: DataResJson | null = null

  get waitingDataGet() {
    return this.__dataPromise.promise
  }

  get data() {
    return this.__data
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
    if (this.__dataIsGotten) return
    try {
      const res = await fetch('/data/RES.json')
      const json = await res.json() as DataResJson
      this.__data = json
      this.__dataPromise.resolve()
      this.__dataIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }
}
