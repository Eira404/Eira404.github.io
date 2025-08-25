import type { ElflandTheme } from '@/core/elfland-addon-theme'
import type { RouteLocationRaw } from 'vue-router'

export type RouterPromiseSyncFuncRes = void | ['success'] | ['redirect', RouteLocationRaw]

export interface ElflandEvents {
  loaded: []
  'theme-change': [ElflandTheme]
  /** live2D */
  'live-2d-model-added': []
  'live-2d-model-removed': []
  'live-2d-shower-destroy': []
  'live-2d-shower-destroyed': []
}
