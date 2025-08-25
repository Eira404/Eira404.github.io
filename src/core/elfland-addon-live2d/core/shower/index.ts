import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import * as PIXI from 'pixi.js'
import type { InternalModel } from '../models/internal-model'
import { watch, type WatchHandle } from 'vue'

export class Live2DShower extends ElflandAddon {
  private __app: PIXI.Application | null = null
  private __live2DModel: InternalModel | null = null
  private __watchHandle: WatchHandle

  constructor(elfland: Elfland) {
    super(elfland)

    this.__watchHandle = watch(elfland.theme.theme, (val) => {
      if (val === 'light') {
        this.__live2DModel?.themeTo('light')
      } else {
        this.__live2DModel?.themeTo('dark')
      }
    })
  }

  loadedCallback(): void {}

  show(options?: PIXI.IApplicationOptions) {
    this.__app = new PIXI.Application(options)
  }

  /**
   * 将模型添加到画面
   *
   * 一个Shower最多只有一个模型
   * @param {Live2DModel} live2dModel Live2DModel实例对象
   */
  async add(live2dModel: InternalModel) {
    if (this.__app === null) return
    if (this.__live2DModel) this.__live2DModel.destroy()
    this.__live2DModel = live2dModel
    await live2dModel.load(this.__app)
    this.__elfland.emit('live-2d-model-added')
    this.__elfland.theme.theme.value === 'light' ? live2dModel.themeTo('light') : live2dModel.themeTo('dark')
    this.__elfland.message.html.addMessage(live2dModel.name, live2dModel.message)
  }

  /**
   * 移除Shower中的模型
   */
  remove() {
    if (this.__live2DModel) {
      this.__live2DModel.destroy()
      this.__live2DModel = null
      this.__elfland.emit('live-2d-model-removed')
    }
  }

  /**
   * 销毁app实例
   * 销毁模型实例
   * 销毁其他实例
   */
  destroy() {
    this.__elfland.emit('live-2d-shower-destroy')
    this.__watchHandle()
    if (this.__live2DModel) this.__live2DModel.destroy()
    if (this.__app) this.__app.destroy()
    this.__elfland.emit('live-2d-shower-destroyed')
  }
}
