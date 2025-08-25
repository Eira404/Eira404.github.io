import { isObject } from '.'
import EventEmitter from 'eventemitter3'

export enum TimerState {
  NULL,
  CREATED,
  ERROR,
  RUNNING,
  INTERRUPT,
  FINISH
}

export type TimerItemOptions = {
  delete: boolean
}

const defaultTimerOptions: TimerItemOptions = {
  delete: false
}

class TimerItem {
  t: Timer
  name: string
  interval: boolean
  time: number
  options: TimerItemOptions
  meta: any
  state: TimerState
  timer: NodeJS.Timeout | null

  constructor(
    t: Timer,
    name: string,
    interval: boolean,
    time: number,
    options: TimerItemOptions,
    meta: any
  ) {
    this.t = t

    this.name = name

    this.interval = interval

    this.time = time

    this.options = options || {}

    this.meta = meta || {}

    this.state = TimerState.NULL

    this.timer = null

    if (!this.check()) this.state = TimerState.ERROR
    else this.state = TimerState.CREATED
  }

  check() {
    if (typeof this.interval !== 'boolean') return false
    if (Number.isNaN(Number(this.time))) return false
    if (this.time < 0 || !Number.isInteger(this.time)) return false
    if (!isObject(this.options) || !isObject(this.meta)) return false
    return true
  }

  start(time?: number) {
    this.time = time || this.time
    if (this.timer !== null) {
      if (this.interval) clearInterval(this.timer)
      else clearTimeout(this.timer)
    }
    if (this.interval) {
      this.timer = setInterval(this.callback.bind(this), this.time)
    } else {
      this.timer = setTimeout(this.callback.bind(this), this.time)
    }
    this.state = TimerState.RUNNING
  }

  stop() {
    if (this.timer) {
      if (this.interval) clearInterval(this.timer)
      else clearTimeout(this.timer)
    }
    this.state = TimerState.INTERRUPT
  }

  callback() {
    this.state = TimerState.FINISH
    const res = {
      meta: this.meta,
      data: {
        name: this.name,
        interval: this.interval,
        time: this.time
      }
    }
    this.t.emit(this.name, res)

    this.afterCallback()
  }

  afterCallback() {
    if (this.options.delete === true) {
      this.t.delete(this.name)
    }
  }

  destroy() {
    if (this.timer) {
      if (this.interval) clearInterval(this.timer)
      else clearTimeout(this.timer)
    }
  }
}

export class Timer extends EventEmitter {
  timerMap: Map<string, TimerItem>
  constructor() {
    super()
    this.timerMap = new Map()
  }

  /**
   * 创建新的计时器
   * ```js
   * const options = {
   *   delete: false, // 倒计时完成自销毁
   * }
   * ```
   *
   * @param {String} name 计时器实例名字（唯一）
   * @param {Boolean} interval 是否循环
   * @param {Number} time 计时器时长
   * @param {Object} options 配置项
   * @param {Object} meta 传递参数
   * @returns 是否创建成功
   */
  create(
    name: string = 'base',
    interval: boolean = true,
    time: number = 0,
    options: TimerItemOptions = defaultTimerOptions,
    meta: any = {}
  ) {
    if (this.has(name)) return false
    const timerItem = new TimerItem(this, name, interval, time, options, meta)
    if (timerItem.state === TimerState.ERROR) return false
    this.timerMap.set(name, timerItem)
    return true
  }

  get(name: string) {
    return this.timerMap.get(name)
  }

  getAll() {
    return Array.from(this.timerMap.entries())
  }

  has(name: string) {
    return this.timerMap.has(name)
  }

  state(name: string) {
    if (!this.has(name)) return false
    return this.get(name)?.state
  }

  start(name: string, time?: number) {
    if (!this.has(name)) return false
    const ti = this.get(name)
    if (ti === undefined) return false
    if (ti.state === TimerState.RUNNING) return false
    ti.start(time)
    return true
  }

  stop(name: string | ((name: string) => boolean)) {
    if (name instanceof Function) {
      const list = this.getAll()
      list.forEach((item) => {
        if (name(item[0]) === true) {
          item[1].stop()
        }
      })
      return true
    }
    if (!this.has(name)) return false
    this.get(name)?.stop()
    return true
  }

  restart(name: string, time?: number) {
    if (!this.has(name)) return false
    this.get(name)?.start(time)
    return true
  }

  delete(name: string) {
    if (!this.has(name)) return false
    this.get(name)?.destroy()
    this.timerMap.delete(name)
    return true
  }

  destroy() {
    const timerItems = this.getAll()
    timerItems.forEach((ti) => {
      ti[1].destroy()
    })
    this.removeAllListeners()
  }
}
