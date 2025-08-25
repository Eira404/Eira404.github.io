import { ElMessage } from 'element-plus'

export * from './stroage'
export * from './lru'
export * from './selector'
export * from './timer'

/**
 * 显示提示框
 * @param msg 提示信息
 * @param type 提示类型（默认error）
 * @param duration 提示时长（默认3000(ms)）
 */
export function message(
  msg: string,
  type?: 'error' | 'success' | 'info' | 'warning',
  duration?: number
) {
  type = type || 'error'
  duration = duration || (type === 'error' ? 4000 : 3000)
  ElMessage({
    message: msg,
    type: type,
    duration: duration
  })
}

export function isNumber(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.every((v) => !Number.isNaN(Number(v)))
  }
  return !Number.isNaN(Number(value))
}

/**
 * 深拷贝对象
 * @param target 深拷贝对象
 * @returns 深拷贝结果
 */
export function deepClone(target: any, stack?: WeakMap<any, any>) {
  function getType(obj: any): string {
    type TypeMap = {
      [property: string]: string
    }
    const map: TypeMap = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    }
    if (obj instanceof Element) {
      return 'element'
    }
    return map[Object.prototype.toString.call(obj)] || 'unknown'
  }

  const type = getType(target)
  if (type === 'array' || type === 'object') {
    // 检查循环引用并返回其对应的克隆
    stack || (stack = new WeakMap())
    const stacked = stack.get(target)
    if (stacked) {
      return stacked
    }
    // 复杂数据类型 递归实现
    //
    if (type === 'array') {
      const _clone: Array<any> = []
      target.forEach((element: any) => {
        _clone.push(deepClone(element, stack))
      })
      stack.set(target, _clone)
      return _clone
    }
    if (type === 'object') {
      type TypeClone = {
        [property: string]: any
      }
      const _clone: TypeClone = {}
      for (const key in target) {
        if (Object.hasOwnProperty.call(target, key)) {
          const element = target[key]
          _clone[key] = deepClone(element, stack)
        }
      }
      stack.set(target, _clone)
      return _clone
    }
  } else {
    // 基础数据类型 直接返回
    //
    return target
  }
}

/**
 * 防抖函数
 * @param func 待执行的函数
 * @param delay 防抖时间 200
 * @returns Function
 */
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number = 200): T {
  let timerId: NodeJS.Timeout | null = null
  return function (this: ThisParameterType<T>, ...args: any[]) {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  } as T
}

/**
 * 节流函数
 * @param func 待执行的函数
 * @param delay 节流时间
 * @returns Function
 */
export function throttle<T extends (...args: any[]) => void>(func: T, delay: number = 200): T {
  let timerId: NodeJS.Timeout | null = null
  let lastExecutedTime = 0
  return function (this: ThisParameterType<T>, ...args: any[]) {
    const currentTime = Date.now()
    const timeSinceLastExecution = currentTime - lastExecutedTime
    if (timeSinceLastExecution >= delay) {
      func.apply(this, args)
      lastExecutedTime = currentTime
    } else {
      if (timerId) {
        clearTimeout(timerId)
      }
      timerId = setTimeout(() => {
        func.apply(this, args)
        lastExecutedTime = Date.now()
      }, delay - timeSinceLastExecution)
    }
  } as T
}

export function parseTimeToSeconds(input: string): number {
  // 定义时间单位到秒的换算关系
  const timeUnits: Record<string, number> = {
    y: 365 * 24 * 60 * 60, // 一年的秒数
    w: 7 * 24 * 60 * 60, // 一周的秒数
    d: 24 * 60 * 60, // 一天的秒数
    h: 60 * 60, // 一小时的秒数
    m: 60, // 一分钟的秒数
    s: 1 // 一秒
  }

  // 定义时间单位的顺序
  const order = ['y', 'w', 'd', 'h', 'm', 's']
  let lastUnitIndex = -1 // 用于记录上一个时间单位的索引

  // 正则表达式匹配时间单位和对应的数字
  const regex = /(\d+)([ywdhms])/g
  let match
  let totalSeconds = 0

  const set = new Set()

  // 遍历匹配结果
  while ((match = regex.exec(input)) !== null) {
    const [fullMatch, number, unit] = match
    const num = parseInt(number, 10)

    // 如果单位不存在或数字不是有效数字，返回 -1
    if (!(unit in timeUnits) || isNaN(num)) {
      return -1
    }

    // 如果单位前面有，返回 -1
    if (set.has(unit)) return -1
    set.add(unit)

    // 检查时间单位的顺序
    const currentUnitIndex = order.indexOf(unit)
    if (currentUnitIndex < lastUnitIndex) {
      // 当前单位出现在上一个单位之前，顺序错误
      return -1
    }
    lastUnitIndex = currentUnitIndex

    // 累加秒数
    totalSeconds += num * timeUnits[unit]
  }

  // 检查是否匹配了整个字符串
  if (input.replace(regex, '') !== '') {
    return -1
  }

  return totalSeconds
}

export function getDatesForNextSevenDays(startDate: Date): Date[] {
  // 创建一个数组来存储日期
  const dates: Date[] = []

  // 将输入的日期复制一份，避免修改原始日期
  let currentDate = new Date(startDate)

  // 循环七次，每次添加一天
  for (let i = 0; i < 7; i++) {
    // 将当前日期的副本添加到数组中
    dates.push(new Date(currentDate))

    // 为当前日期加一天
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
  }

  return dates
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份从0开始，需要+1
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 随机字符串生成函数生成器
 * - 闭包存储map
 * @param characters_ 可选的字符
 * @returns 随机字符串生成函数
 */
export function generateRandomStringBase(characters_?: string) {
  const idMap = new Map()
  idMap.set('', true)
  return function (length = 10) {
    let result = ''
    const length_ = length
    const characters =
      characters_ || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const charactersLength = characters.length

    while (idMap.get(result) === true) {
      for (let i = 0; i < length_; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
    }
    idMap.set(result, true)

    return result
  }
}

/**
 * 判断是否是Object
 * @param value 待判定对象
 * @returns 是否是Object
 */
export function isObject(value: any) {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

/**
 * 概率函数
 * @param a 分子
 * @param b 分母
 * @returns 在概率(a/b)下，本次运行是否触发
 */
export function probability(a: number, b: number): boolean {
  if (a <= 0 || b <= 0) {
    throw new Error('输入的a和b必须大于0')
  }
  const random = Math.random()
  return random < a / b
}

/**
 * 判断是否在时间区间内部
 * @param timePeriods 时间区间数据
 * @returns 是否在时间区间内部
 */
export function isInTimeInterval(timePeriods: Array<[number, number]>): boolean {
  // 获取当前时间
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  // 将当前时间转换为分钟
  const currentMinutes = hours * 60 + minutes

  // 遍历时间区间列表
  for (const [start, end] of timePeriods) {
    // 将时间区间的开始和结束时间转换为分钟
    const startMinutes = start * 60
    const endMinutes = end === 24 ? 24 * 60 : end * 60 // 如果结束时间是24，转换为1440

    // 检查当前时间是否在时间区间内
    // 如果当前时间大于等于开始时间，并且小于结束时间
    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return true
    }
  }

  // 如果当前时间不在任何时间区间内，返回false
  return false
}

/**
 * 创建一个连点校验函数
 * @param time 点击最大间隔时间
 * @param amount 点击次数
 * @returns 触发函数
 */
export function createQuickClickJudge(time = 400, amount = 5) {
  let now = 0
  let timer: NodeJS.Timeout | null = null
  return function <T extends (...args: any[]) => void>(func: T) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      now = 0
    }, time)
    now++
    if (now >= amount) {
      func()
    }
  }
}
