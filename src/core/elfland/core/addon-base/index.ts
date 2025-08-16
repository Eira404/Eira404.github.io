import type { RouteLocationNormalized } from 'vue-router'
import type { Elfland } from '..'

export abstract class ElflandAddon {
  protected readonly __elfland: Elfland

  constructor(elfland: Elfland) {
    this.__elfland = elfland

    elfland.on('logout', this.logoutCallback, this)
  }

  abstract logoutCallback(): void

  /**
   * 去往的页面的name是否是输入的name
   * @param to RouteLocationNormalized
   * @param name string
   * @returns boolean
   */
  is(to: RouteLocationNormalized, name: string): boolean {
    return to.name === name
  }

  /**
   * 去往的页面的路由是否包含输入的name
   * @param to RouteLocationNormalized
   * @param name string
   * @returns boolean
   */
  includes(to: RouteLocationNormalized, name: string): boolean {
    return to.matched.find(item => item.name === name) !== undefined
  }
}
