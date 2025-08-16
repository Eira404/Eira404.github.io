import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import type Renderer from 'markdown-it/lib/renderer.mjs'
import type { Options } from 'markdown-it'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs'

type ConfigKey = string | string[]

export interface TemplatePluginOptions {
  tokenizePos?: number[] | boolean
  markerBegin?: string
  markerEnd?: string
  markerDivision?: string
  useEqual?: boolean
  useIndex?: boolean
  configKeys?: ConfigKey[]
  render?: (tokens: Token[], idx: number, _options: Options, env: any, slf: Renderer) => string
  renderDivision?: (
    tokens: Token[],
    idx: number,
    _options: Options,
    env: any,
    slf: Renderer
  ) => string
}

type DivisionData = {
  begin: number
  end: number
}

type FindEndRes = {
  check: boolean
  pos?: number
  divisionDataList?: DivisionData[]
}

type ConfigsDict = {
  [property: string]: string | string[]
}

/**
 * ## MD模板
 * 默认模板格式如下：`{{name|some words ....|config1|config2=xxx|config3=a,b,c,...}}`
 *
 * 1. tokenize默认为第二位(index = 1)
 * 2. 第一个位置必须是name且不会进行解析
 * 3. 可以通过设置tokenizePos进行不同位置的解析，为true则全部都解析，false等价于[1]
 * 3. 当tokenizePos超过一个时，会自动生成token: template_name_division
 * 4. 不属于tokenizePos的内容将会加入configData
 * 5. 模板名字请不要重复
 *
 * ## options
 *
 * ```ts
 * interface TemplatePluginOptions {
 *   markerBegin?: string // 匹配起始标识符 默认: {{
 *   markerEnd?: string // 匹配结束标识符 默认: }}
 *   markerDivision?: string // 配置项分割标识符 默认: {{
 *   useEqual?: boolean // 是否启用=判定，启用则支持语法: configKey1=abc => { configKey1: abc }
 *   useIndex?: boolean // 是否启用下标顺序判定，启用则支持语法: 1=abc 从1开始!!
 *   // => 1. 设置了configKeys=['configKey1'] => { configKey1: abc }
 *   // => 2. 没有设置configKeys => { '1': abc }
 *   configKeys?: configKey[] // 设置配置项选择值，便于数据读取
 *   // 需要注意conf字符串不能是数字，不能是: '100'
 *   // ['conf1', 'conf2'] 设置两个conf，其分别对应1和2
 *   // [['conf1-1', 'conf1-2'], 'conf2'] 设置两个conf，但是输入: conf1-2=abc\1=abc\abc => { 'conf1-1': abc },会以数组中第一个进行替换
 *   render?: (tokens: Token[], idx: number, _options: Options, env: any, slf: Renderer) => string 自定义渲染函数
 *   renderDivision?: (tokens: Token[], idx: number, _options: Options, env: any, slf: Renderer) => string 自定义分割渲染函数
 * }
 * ```
 *
 * @param md md
 * @param name 模板名字
 * @param options 配置项
 */
export default function templatePlugin(
  md: MarkdownIt,
  name: string | string[],
  options?: TemplatePluginOptions
) {
  function renderDefault(tokens: Token[], idx: number, _options: Options, env: any, slf: Renderer) {
    return slf.renderToken(tokens, idx, _options)
  }

  function renderDivisionDefault(
    tokens: Token[],
    idx: number,
    _options: Options,
    env: any,
    slf: Renderer
  ) {
    return slf.renderToken(tokens, idx, _options)
  }

  options = options || {}

  const defaultName = Array.isArray(name) ? name[0] : name
  const namesSet = new Set(Array.isArray(name) ? name : [name])

  const tokenizePos = options.tokenizePos || [1]

  const markerBegin = options.markerBegin || '{{'
  const markerEnd = options.markerEnd || '}}'
  const markerDivision = options.markerDivision || '|'
  //
  // 为true则支持语法：config1 = xxx
  //
  const useEqual = options.useEqual || true
  //
  // 0 = xxx
  // xxx
  // ->
  // 0: xxx
  //
  const useIndex = options.useIndex || false
  //
  // config keys
  // 设置这个才能更好的使用 0=xxx
  // 例如: 设置["color"];md中写0=red
  // 获得: { "color": "red" }
  // 否则获得: { "0": "red" }
  //
  const configKeys = options.configKeys || []
  //
  // 配置映射关系
  //
  const confMap = buildConfMap(configKeys)

  const render = options.render || renderDefault

  const renderDivision = options.renderDivision || renderDivisionDefault

  function buildConfMap(configKeys: ConfigKey[]) {
    const map = new Map<string, string>()
    configKeys.forEach((conf) => {
      if (Array.isArray(conf)) {
        const base = conf[0]
        conf.forEach((c) => {
          map.set(base, c)
        })
      } else {
        map.set(conf, conf)
      }
    })
    return map
  }

  /**
   * 找结束位置
   * @param state
   * @returns
   */
  function findEnd(state: StateInline): FindEndRes {
    const max = state.posMax
    let pos = state.pos + markerBegin.length
    let level = 0
    let lastDivisionPos = pos
    const divisionDataList = []
    while (pos < max) {
      if (markerBegin === state.src.slice(pos, pos + markerBegin.length)) {
        level++
      } else if (markerEnd === state.src.slice(pos, pos + markerEnd.length)) {
        if (level === 0) {
          divisionDataList.push({
            begin: lastDivisionPos,
            end: pos
          })
          return {
            check: true,
            pos,
            divisionDataList
          }
        } else level--
      } else if (markerDivision === state.src.slice(pos, pos + markerDivision.length)) {
        if (level === 0) {
          divisionDataList.push({
            begin: lastDivisionPos,
            end: pos
          })
          lastDivisionPos = pos + 1
        }
      }
      pos++
    }
    return {
      check: false
    }
  }

  /**
   * 解析配置项
   * @param config
   * @param configs
   * @param i
   * @returns
   */
  function analyseConfig(config: string, configs: ConfigsDict, i: number) {
    // console.log('analyseConfig', config, i)
    const equalRegexp = /(?<!\\)=/g
    const commaRegexp = /(?<!\\),/g

    const equalRes = equalRegexp.exec(config)
    equalRegexp.lastIndex = 0
    const equalIndex = equalRes === null ? -1 : equalRes.index
    const key = equalIndex === -1 ? i.toString() : config.slice(0, equalIndex).trim()
    const value_ = equalIndex === -1 ? config : config.slice(equalIndex + 1).trim()
    const value = []
    let commaRes = commaRegexp.exec(value_)
    let from = 0
    while (commaRes !== null) {
      value.push(value_.slice(from, commaRes.index).trim())
      from = commaRes.index + 1
      commaRes = commaRegexp.exec(value_)
    }
    value.push(value_.slice(from).trim())
    commaRegexp.lastIndex = 0
    //
    // 允许使用=语法，且获取到=，且不是0=xxx的情况
    //
    if (useEqual && equalIndex !== -1 && Number.isNaN(Number(key))) {
      //
      // 找到该conf对应的conf
      //
      const trueKey = confMap.get(key)
      if (trueKey === undefined) {
        //
        // 匹配失败不生效
        //
        return
      } else {
        configs[trueKey] = value
        return
      }
    }
    //
    // 允许使用0=和直接下标映射语法，且key是数字
    //
    if (useIndex && !Number.isNaN(Number(key))) {
      const index = Number(key)
      if (configKeys[index] !== undefined) {
        if (Array.isArray(configKeys[index])) {
          configs[configKeys[index][0]] = value
        } else {
          configs[configKeys[index]] = value
        }
      } else {
        configs[key] = value
      }
      return
    }
  }

  /**
   * 插件核心
   * @param state
   * @param slient
   * @returns
   */
  function template(state: StateInline, slient: boolean) {
    const max = state.posMax // src长度
    const start = state.pos

    if (markerBegin !== state.src.slice(start, start + markerBegin.length)) {
      return false
    }
    //
    // 找结束
    // posEnd指向结束符号开始的位置
    // }}
    // ⬆
    //
    const endRes = findEnd(state)

    if (!endRes.check) {
      return false
    }
    //
    // check为true下面都存在
    //
    const end = endRes.pos as number
    const divisionDataList = endRes.divisionDataList as DivisionData[]

    if (
      divisionDataList.length < 1 ||
      !namesSet.has(state.src.slice(divisionDataList[0].begin, divisionDataList[0].end).trim())
    ) {
      return false
    }
    //
    // found
    //
    const tStart = start + markerBegin.length
    const tEnd = end

    const configs = {}

    let tokenizeAmount = 0

    if (!slient) {
      state.pos = tStart
      state.posMax = tEnd

      const token_o = state.push('template_' + defaultName + '_open', 'span', 1)

      let configIndex = 0

      divisionDataList.forEach((data, i) => {
        if (i === 0) return
        state.pos = data.begin
        state.posMax = data.end
        if (tokenizePos === true || (Array.isArray(tokenizePos) && tokenizePos.indexOf(i) !== -1)) {
          if (tokenizeAmount > 0) state.push('template_' + defaultName + '_division', '', 0)
          state.md.inline.tokenize(state)
          tokenizeAmount++
        } else {
          analyseConfig(state.src.slice(data.begin, data.end), configs, configIndex++)
        }
      })

      token_o.meta = {
        configs
      }

      state.push('template_' + defaultName + '_close', 'span', -1)
    }

    state.pos = end + markerEnd.length
    state.posMax = max
    return true
  }

  md.inline.ruler.after('emphasis', 'template_' + defaultName, template)

  md.renderer.rules['template_' + defaultName + '_open'] = render
  md.renderer.rules['template_' + defaultName + '_close'] = render
  md.renderer.rules['template_' + defaultName + '_division'] = renderDivision
}
