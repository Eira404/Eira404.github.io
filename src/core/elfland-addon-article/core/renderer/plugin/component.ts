import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import type Renderer from 'markdown-it/lib/renderer.mjs'
import type { Options } from 'markdown-it'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'

type ConfigKey = string | string[]

type ConfigsDict = {
  [property: string]: string | string[]
}

export interface ComponentPluginOptions {
  init?: (options: ComponentPluginOptions) => void
  markerBegin?: string
  markerEnd?: string
  dataDivision?: string
  configDivision?: string
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

type FindStartRes =
  | {
      check: false
    }
  | {
      check: true
      name: boolean
      pos?: number
    }

type FindEndRes =
  | {
      check: false
    }
  | {
      check: true
      pos: number
    }

type FindDataDRes =
  | {
      check: false
    }
  | {
      check: true
      pos: number
    }

type AnsDataRes =
  | {
      check: false
    }
  | {
      check: true
      silent: true
    }
  | {
      check: true
      silent?: true
      configList: string[]
      dataList: Array<{ lineBegin: number; lineEnd: number }>
      markerBeginData: {
        markup: string
        pos: number
        line: number
      }
      markerEndData: {
        markup: string
        line: number
      }
    }

export default function componentPlugin(
  md: MarkdownIt,
  name: string | string[],
  options?: ComponentPluginOptions
) {
  if (typeof name !== 'string' || name === '') return

  const defaultName = Array.isArray(name) ? name[0] : name
  const namesSet = new Set(Array.isArray(name) ? name : [name])

  function renderDefault(tokens: Token[], idx: number, _options: Options, env: any, slf: Renderer) {
    //
    // add a class to the opening tag
    //
    if (tokens[idx].nesting === 1) {
      tokens[idx].attrJoin('class', defaultName)
    }
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

  const markerBegin = options.markerBegin || '{|'
  const markerEnd = options.markerEnd || '|}'
  const dataDivision = options.dataDivision || '|-'
  const configDivision = options.configDivision || '|'
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

  if (options.init instanceof Function) options.init(options)

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

  function isComponentBegin(state: StateBlock, start: number): FindStartRes {
    // 在行内寻找 markerBegin
    // markerBegin 必须是一行起始
    //
    const l = markerBegin.length
    // 检查是否是以 markerBegin 起始
    //
    if (markerBegin !== state.src.slice(start, start + l)) {
      return {
        check: false
      }
    }

    // 以 markerBegin 起始
    // 检查后面是否跟着 自己的name
    //
    const p = state.src.indexOf(configDivision, start + l)
    // console.log('configDivision', state.src, configDivision, p)
    const n = state.src.slice(start + l, p).trim()
    // console.log('n', n, namesSet)
    if (!namesSet.has(n)) {
      return {
        check: true,
        name: false
      }
    }

    return {
      check: true,
      name: true,
      pos: start + l + name.length
    }
  }

  function isComponentEnd(state: StateBlock, start: number): FindEndRes {
    // 在行内寻找 markerEnd
    // markerEnd 必须是一行起始
    // markerEnd 后面内容无效
    //

    // 检查是否是以 markerEnd 起始
    //
    if (markerEnd !== state.src.slice(start, start + markerEnd.length)) {
      return {
        check: false
      }
    }

    return {
      check: true,
      pos: start
    }
  }

  function isDataDivision(state: StateBlock, start: number): FindDataDRes {
    // 在行内寻找 dataDivision
    // dataDivision 必须是一行起始
    // dataDivision 后面内容无效
    //

    // 检查是否是以 dataDivision 起始
    //
    if (dataDivision !== state.src.slice(start, start + dataDivision.length)) {
      return {
        check: false
      }
    }

    return {
      check: true,
      pos: start
    }
  }

  function analyseData(
    state: StateBlock,
    startLine: number,
    endLine: number,
    silent: boolean
  ): AnsDataRes {
    // 找到一对marker
    // 要考虑到嵌套关系
    //
    let markerLevel = 0
    let line = startLine
    let markerBeginData = null
    let markerEndData = null
    let lastDataDivisionLine = -1
    const dataList = []
    let configList = null
    for (; line < endLine; line++) {
      const start = state.bMarks[line] + state.tShift[line]
      const max = state.eMarks[line]
      const res1 = isComponentBegin(state, start)
      if (res1.check) {
        if (res1.name) {
          // 匹配到本模板的起始
          // pos不包括前面的内容
          // {|name|xxx|yyy|zzz...
          //       ⬆
          // pos指向'|'
          //
          if (markerBeginData) {
            // 匹配到本模板开始
            // 但已经存在本模板
            // 为嵌套
            //
            markerLevel++
          } else {
            // 匹配到本模板开始
            //
            markerBeginData = {
              markup: markerBegin,
              pos: res1.pos as number,
              line: line
            }

            // Since start is found, we can report success here in validation mode
            //
            if (silent) {
              return {
                check: true,
                silent: true
              }
            }
          }
        } else {
          // 匹配到模板开始，但是不是本模板
          //
          markerLevel++
        }
      } else {
        if (markerBeginData === null) {
          // 第一次就匹配失败
          // 不是本组件
          //
          return {
            check: false
          }
        }
        // 没有匹配到模板开始
        // 检查模板结束
        const res2 = isComponentEnd(state, start)
        if (res2.check) {
          if (markerLevel === 0) {
            markerEndData = {
              markup: markerEnd,
              line: line
            }
            // 匹配结束
            //
            if (lastDataDivisionLine !== -1) {
              dataList.push({
                lineBegin: lastDataDivisionLine + 1,
                lineEnd: line
              })
            }
            return {
              configList: configList || [],
              dataList,
              check: true,
              markerBeginData,
              markerEndData
            }
          } else {
            // 退出上层模板
            //
            markerLevel--
          }
        } else {
          // 也没有匹配到模板结束
          // 检查模板数据分隔符
          //
          const res3 = isDataDivision(state, start)
          if (res3.check && markerLevel === 0) {
            // 匹配到数据分隔符 且 是本组件的数据分割符
            //
            if (configList === null) {
              // 还没有进行config设置
              //
              const configStr = state.src.slice(markerBeginData.pos, res3.pos)
              configList = configStr
                .split(configDivision)
                .map((conf) => conf.trim())
                .filter((conf) => conf !== '')
              lastDataDivisionLine = line
            } else {
              // 已经进行config设置
              //
              if (line - lastDataDivisionLine <= 1) {
                // 两个dataDivision没有间隔
                // 无法获取data数据
                // 跳过
                //
              } else {
                // 存入data
                // 闭 - 开
                //
                dataList.push({
                  lineBegin: lastDataDivisionLine + 1,
                  lineEnd: line
                })
              }
              // 更新
              //
              lastDataDivisionLine = line
            }
          } else {
            // 啥也没匹配到
            //
            continue
          }
        }
      }
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

  function analyseConfigList(configList: string[]) {
    const configs = {}
    configList.forEach((config, i) => {
      analyseConfig(config, configs, i)
    })
    return configs
  }

  function component(state: StateBlock, startLine: number, endLine: number, silent: boolean) {
    const res = analyseData(state, startLine, endLine, silent)
    if (!res.check) return false
    if (res.silent !== undefined) return true

    const oldParent = state.parentType
    const oldLineMax = state.lineMax
    state.parentType = 'blockquote'

    // this will prevent lazy continuations from ever going past our end marker
    state.lineMax = res.markerEndData.line

    const token_o = state.push('component_' + name + '_open', 'div', 1)
    token_o.markup = markerBegin
    token_o.block = true
    token_o.meta = {
      configs: analyseConfigList(res.configList)
    }
    token_o.map = [res.markerBeginData.line, res.markerEndData.line]

    res.dataList.forEach((data, i) => {
      const start = state.bMarks[data.lineBegin] + state.tShift[data.lineBegin]
      const end = state.bMarks[data.lineEnd] + state.tShift[data.lineEnd]
      const dataSrc = state.src.slice(start, end)
      let res
      // if (dataCheck instanceof Function) {
      //   res = dataCheck(dataSrc, i, {})
      // }
      // res 为false时直接跳过分隔符
      // 但是其内部内容依旧会渲染
      // 感觉res为false的可能性几乎没有
      //
      if (res === false) return

      if (i > 0) {
        // 添加数据分隔符token
        //
        const token_d = state.push('component_' + name + '_division', 'div', 0)
        token_d.markup = dataDivision
        token_d.meta = {
          index: i
        }
      }
      state.md.block.tokenize(state, data.lineBegin, data.lineEnd)
    })

    const token_c = state.push('component_' + name + '_close', 'div', -1)
    token_c.markup = markerEnd
    token_c.block = true

    state.parentType = oldParent
    state.lineMax = oldLineMax
    state.line = res.markerEndData.line + 1
    return true
  }

  md.block.ruler.before('fence', 'component_' + name, component, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
  md.renderer.rules['component_' + name + '_open'] = render
  md.renderer.rules['component_' + name + '_close'] = render
  md.renderer.rules['component_' + name + '_division'] = renderDivision
}
