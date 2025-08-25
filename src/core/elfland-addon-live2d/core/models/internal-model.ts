import CubismModelWrapper from './cubism-model-wrapper'
import * as PIXI from 'pixi.js'
import { Live2DModel, ModelSettings, type JSONObject } from 'pixi-live2d-display/cubism4'
import { deepClone, Timer } from '@/core/elfland/utils'
import type { ElflandTheme } from '@/core/elfland-addon-theme'
import type { ExpressionData, ModelConfig, ParameterData } from '../../types/model'
import type { MessageDictHTML } from '@/core/elfland-addon-message-manager/types'

export abstract class InternalModel extends CubismModelWrapper {
  static name = 'default'
  protected abstract __costumes: string[]
  readonly abstract message: MessageDictHTML
  /**
   * 模型名字
   */
  readonly name: string
  protected __model: Live2DModel | null = null
  /**
   * live2d模型配置项
   */
  protected __live2DFrom: string | JSONObject | ModelSettings
  protected __line2DModelConfig: ModelConfig
  /** Map<groupId, Map<Parameter的id（不是parameterId）, ParameterData>> */
  protected __live2DParameterDatas: Map<string, Map<string, ParameterData>> = new Map()
  /** Map<Parameter的id（不是parameterId）, ParameterData> */
  protected __live2DAllParameterDatas: Map<string, ParameterData> = new Map()
  /** Map<expressionId, ExpressionData> */
  protected __live2DExpressionDatas: Map<string, ExpressionData> = new Map()
  /** Map<groupId, Parameter的id（不是parameterId）> 当前激活的Parameter */
  protected __live2DActiveParameterDatas: Map<string, string> = new Map()
  protected __timer: Timer

  protected __statusData = {
    hitIgnore: false
  }

  protected __idleStop: (() => void) | null = null

  get costumes() {
    return Array.from(this.__costumes)
  }

  constructor(live2DFrom: string | JSONObject | ModelSettings, modelConfig: ModelConfig) {
    super()

    this.name = modelConfig.name || 'default'

    this.__live2DFrom = live2DFrom
    this.__line2DModelConfig = modelConfig

    /**
     * 动画计时器
     */
    this.__timer = new Timer()

    this.init()
  }

  init() {
    /**
     * 创建表情恢复计时器
     * 创建闲暇状态计时器
     */
    this.__timer.create('idle', false, 1000 * 60 * 5)
    /**
     * 监听闲暇状态计时器
     */
    this.__timer.on('idle', () => {
      this.__idleStop = this.idle()
    }, this)
    /** 启动闲暇状态计时器 */
    this.__timer.restart('idle')

    this.__line2DModelConfig.expressionDatas.forEach(exp => {
      this.__live2DExpressionDatas.set(exp.id, exp)
    })
    this.__line2DModelConfig.parameterGroups.forEach(g => {
      const map: Map<string, ParameterData> = new Map()
      g.parameterDatas.forEach(p => {
        map.set(p.id, p)
        this.__live2DAllParameterDatas.set(p.id, p)
      })
      this.__live2DParameterDatas.set(g.groupId, map)
    })
  }

  /**
   * 设置是否忽略点击区域
   * @param hitIgnore 是否忽略点击区域
   */
  setHitIgnore(hitIgnore: boolean) {
    this.__statusData.hitIgnore = hitIgnore
  }

  /**
   * 由shower调用，加载模型数据
   * @param app PIXI.Application
   * @returns 是否加载成功
   */
  async load(app: PIXI.Application): Promise<boolean> {
    this.__model = await Live2DModel.from(this.__live2DFrom)
    if (this.__destroyed || this.__model === null || app.stage === null) return false
    app.stage.addChild(this.__model)
    this.setCubismModel(this.__model.internalModel.coreModel, (this.__model.internalModel.motionManager as any).expressionManager)
    this.__model.on('hit', (hitAreas) => {
      this.hitAreasBase(hitAreas)
    })

    this.loaded()
    this.emit('loaded')
    return true
  }

  protected abstract loaded(): void

  destroy() {
    super.destroy()
    if (this.__timer) this.__timer.destroy()
    if (this.__model) this.__model.destroy()
  }

  /**
   * 空闲状态触发
   */
  protected abstract idle(): () => void

  private changeParameterValue(
    groupId: string,
    id: string,
    add: boolean,
    clear: boolean = false
  ): boolean {
    const group = this.__live2DParameterDatas.get(groupId)
    if (!group || clear || !group.has(id)) return false
    /** parameterData在clear为true的情况下无效 */
    const parameterData = group.get(id)!
    const live2DActiveParameterDatas = this.__live2DActiveParameterDatas
    const activeId = live2DActiveParameterDatas.get(groupId)
    if (!add) {
      /** remove */
      if (!clear && activeId !== id) return false
      if (activeId === undefined) return false
      live2DActiveParameterDatas.delete(groupId)
      /** clear 情况下用add */
      if (clear || parameterData.blend === 'Add') {
        this.addParameterValueById(activeId, 0, parameterData.weight)
      } else {
        this.multiplyParameterValueById(activeId, 0, parameterData.weight)
      }
      return true
    }
    /** add */
    // if (Array.from(this.__live2DActiveParameterDatas.values()).includes(parameterId)) return true
    if (activeId === id) return true
    if (activeId !== undefined || parameterData.parameterId === 'NULL') this.changeParameterValue(groupId, '', false, true)
    if (parameterData.parameterId === 'NULL') return true
    live2DActiveParameterDatas.set(groupId, id)
    if (parameterData.blend === 'Add') {
      this.addParameterValueById(
        parameterData.parameterId,
        parameterData.value,
        parameterData.weight
      )
    } else {
      this.multiplyParameterValueById(
        parameterData.parameterId,
        parameterData.value,
        parameterData.weight
      )
    }
    return true
  }

  /**
   * 为模型添加Parameter
   * @param groupId Parameter组
   * @param id ParameterId
   * @returns 是否添加成功
   */
  protected addParameter(groupId: string, id: string): boolean {
    return this.changeParameterValue(groupId, id, true)
  }

  /**
   * 为模型移除Parameter
   * @param groupId Parameter组
   * @param id ParameterId
   * @param clear boolean 是否移除Parameter，不在意ParameterId是否是已激活的ParameterId
   * @returns 是否移除成功
   */
  protected removeParameter(groupId: string, id: string, clear: boolean = false): boolean {
    return this.changeParameterValue(groupId, id, false, clear)
  }
  /**
   * 为模型添加Parameter
   * @param groupId Parameter组
   * @param id ParameterId
   * @returns 是否添加成功
   */
  protected addParameterOnlyForMap(groupId: string, id: string): boolean {
    const group = this.__live2DParameterDatas.get(groupId)
    if (!group || !group.has(id)) return false
    const parameterData = group.get(id)!
    const live2DActiveParameterDatas = this.__live2DActiveParameterDatas
    live2DActiveParameterDatas.set(groupId, parameterData.id)
    return true
  }

  /**
   * 为模型移除Parameter
   * @param groupId Parameter组
   * @returns 是否移除成功
   */
  protected removeParameterOnlyForMap(groupId: string): boolean {
    if (!this.__live2DParameterDatas.has(groupId)) return false
    this.__live2DActiveParameterDatas.delete(groupId)
    return true
  }

  /**
   * null会将groupId参数移除
   * @param {String} expression expressionId 或 Record<groupId, id | null> 表情
   * @returns
   */
  protected addExpression(expression: string | Record<string, string | null>) {
    console.log(expression)
    if (this.__destroyed) return
    if (!this.__model) return
    const temp =
      typeof expression === 'string'
        ? this.__live2DExpressionDatas.get(expression)?.parameterDatas
        : expression
    if (temp === undefined) return
    expression = temp
    Object.entries(expression).forEach(([k, v]) => {
      if (v === null) {
        this.removeParameterOnlyForMap(k)
      } else {
        this.addParameterOnlyForMap(k, v)
      }
    })
    this.showExpression()
  }

  /**
   * reverse === true时，expression类型为string[]，代表不需要移除参数的groupId，其余的groupId参数都会被移除
   * @param expression 不需要移除参数的groupId
   * @param reverse true
   */
  protected removeExpression(expression: string[], reverse?: true): void
  /**
   *
   * reverse === false时，expression类型为string | Record<string, string | null> | null，代表需要移除的表情id、参数id、全部移除
   * @param expression 需要移除的表情id、参数id、全部移除
   * @param reverse false
   */
  protected removeExpression(
    expression: string | Record<string, string | null> | null,
    reverse?: false,
  ): void
  protected removeExpression(
    expression: string | Record<string, string | null> | null | string[],
    reverse: boolean = false
  ): void {
    const parameterData = this.__live2DActiveParameterDatas
    if (reverse) {
      if (!Array.isArray(expression)) return
      Object.entries(parameterData).forEach(([k]) => {
        if (!expression.includes(k)) {
          this.removeParameterOnlyForMap(k)
        }
      })
    } else {
      const temp =
        typeof expression === 'string'
          ? this.__live2DExpressionDatas.get(expression)?.parameterDatas
          : expression
      if (temp === undefined || Array.isArray(temp)) return
      if (temp === null) {
        Object.entries(parameterData).forEach(([k, v]) => {
          this.removeParameterOnlyForMap(k)
        })
      } else {
        Object.entries(temp).forEach(([k, v]) => {
          if (v === null) {
            this.removeParameterOnlyForMap(k)
          } else {
            this.removeParameterOnlyForMap(k)
          }
        })
      }
    }
    this.showExpression()
  }

  private showExpression() {
    if (!this.__model) return
    const data = this.createExpressionFileData()
    this.pushExpressionData(data.name)
    this.__model.expression(data.name, data.data)
  }

  private createGroupList() {
    return this.__line2DModelConfig.parameterGroups.map(g => g.groupId)
  }

  private createExpressionFileData() {
    const groupList = this.createGroupList()
    const parameterList = groupList.map(g => this.__live2DActiveParameterDatas.get(g) || 'NULL')
    const parameters = parameterList.map(p => {
      if (p === 'NULL') return null
      const pa = this.__live2DAllParameterDatas.get(p)
      if (pa === undefined) return null
      return {
        Id: pa.parameterId,
        Value: pa.value,
        Blend: pa.blend
      }
    }).filter(i => i !== null)
    return {
      data: {
        Type: 'Live2D Expression',
        Parameters: parameters
      },
      name: parameterList.join('-')
    }
  }

  /**
   * 点击事件触发
   * @param {Array} hitAreas 点击区域列表
   */
  private hitAreasBase(hitAreas: string[]) {
    if (this.__statusData.hitIgnore) {
      this.__statusData.hitIgnore = false
      return false
    }
    // 重启空闲状态计时器
    //
    if (this.__idleStop) {
      this.__idleStop()
      this.__idleStop = null
    }
    this.__timer.restart('idle')
    this.hitAreas(hitAreas)
    this.emit('hitAreas', hitAreas)
    return true
  }

  protected abstract hitAreas(hitAreas: string[]): void

  /**
   * 改变模型主题
   * @param {*} theme 主题
   * @returns
   */
  themeTo(theme: ElflandTheme) {
    if (theme === 'light') {
      this.addExpression('light')
    } else {
      this.addExpression('dark')
    }
  }

  /**
   * 更换模型服装
   * @param {*} costume 服装
   * @returns
   */
  abstract costumeTo(costume: string): boolean
}
