import type { MessageDictHTML } from '@/core/elfland-addon-message-manager/types'
import { InternalModel } from '../internal-model'
import { config, live2DFrom } from './config'
import { createQuickClickJudge, isInTimeInterval, probability } from '@/core/elfland/utils'
import message from './message'

export class ARTILive2D extends InternalModel {
  readonly message: MessageDictHTML = message.html
  protected __costumes: string[] = ['常服', '睡衣']
  protected __quickClickFace: ReturnType<typeof createQuickClickJudge>
  protected __quickClickFaceActive: boolean
  protected __quickClickHead: ReturnType<typeof createQuickClickJudge>
  protected __quickClickHeadActive: boolean
  protected __quickClickBody: ReturnType<typeof createQuickClickJudge>
  protected __quickClickBodyActive: boolean

  protected __canChangeExpression: boolean = true

  protected __currentCostume: string = ''

  constructor() {
    super(live2DFrom, config)

    this.__quickClickFace = createQuickClickJudge()
    this.__quickClickFaceActive = false
    this.__quickClickHead = createQuickClickJudge()
    this.__quickClickHeadActive = false
    this.__quickClickBody = createQuickClickJudge(400, 8)
    this.__quickClickBodyActive = false

    this.__timer.create('expression', false, 5000)
    this.__timer.on('expression', () => {
      this.addExpression('无表情')
      this.costumeTo(this.__currentCostume)
      this.__canChangeExpression = true
      this.__quickClickFaceActive = false
      this.__quickClickHeadActive = false
      this.__quickClickBodyActive = false
    })
  }

  protected loaded() {
    if (this.__model === null) return
    this.__model.x = -170
    // this.__model.x = -370
    this.__model.y = 10
    this.__model.scale.set(0.30)
    // this.__model.scale.set(0.50)

    const night = isInTimeInterval([[0, 7], [19, 24]])
    const bikini = probability(1, 100)

    this.__currentCostume = bikini ? 'bikini' : night ? '睡衣' : '常服'

    this.costumeTo(this.__currentCostume)

    // 0 - 1
    // this.addParameterValueById('ParamMouthOpenY', 1)
    // -0.5 - 0.5
    // this.addParameterValueById('ParamMouthForm', -0.5)
  }

  setParameter(parameterId: string, value: number) {
    return this.setParameterValueById(parameterId, value)
  }

  protected idle(): () => void {
    const type = probability(1, 2) ? '螃蟹' : '小鸟'
    this.addExpression({ '待机': type })
    return () => {
      this.removeExpression({ '待机': type })
    }
  }

  protected hitAreas(hitAreas: string[]): void {
    if (hitAreas[0] === 'Body') {
      if (this.__quickClickBodyActive) return
      this.addExpression('坏')
      this.restartTimerChangeToNoExpression(true)
      this.__quickClickBody(() => {
        this.__quickClickBodyActive = true
        this.addExpression('杀')
        this.restartTimerChangeToNoExpression(false)
      })
    } else if (hitAreas.indexOf('Face') !== -1) {
      if (this.__quickClickFaceActive) return
      this.addExpression('害羞')
      this.restartTimerChangeToNoExpression(true)
      this.__quickClickFace(() => {
        this.__quickClickFaceActive = true
        this.addExpression('生气')
        this.restartTimerChangeToNoExpression(false)
      })
    } else {
      // Head
      if (this.__quickClickHeadActive) return
      this.addExpression('好')
      this.restartTimerChangeToNoExpression(true)
      this.__quickClickHead(() => {
        this.__quickClickHeadActive = true
        this.addExpression('变傻')
        this.restartTimerChangeToNoExpression(false)
      })
    }
  }

  protected restartTimerChangeToNoExpression(canchangeExpression: boolean = true, duration: number = 5000) {
    if (!this.__canChangeExpression) return
    this.__canChangeExpression = canchangeExpression
    this.__timer.restart('expression', duration)
  }

  costumeTo(costume: string): boolean {
    this.addExpression({ '着装': costume })
    return true
  }
}
