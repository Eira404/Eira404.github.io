import type { ElflandTheme } from '@/core/elfland-addon-theme'
import type { RouteLocationRaw } from 'vue-router'

export type RouterPromiseSyncFuncRes = void | ['success'] | ['redirect', RouteLocationRaw]

export interface ElflandEvents {
  logout: []
  'theme-change': [ElflandTheme]
}
