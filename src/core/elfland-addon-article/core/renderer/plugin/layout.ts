export default function LayoutPlugin(md: any, name: string, options: any) {
  function renderDefault(tokens: any[], idx: number, _options: any, env: any, slf: any) {
    // add a class to the opening tag
    if (tokens[idx].nesting === 1) {
      tokens[idx].attrJoin('class', name)
    }
    return slf.renderToken(tokens, idx, _options, env, slf)
  }

  options = options || {}
  const markerBegin = '{('
  const markerEnd = ')}'
  const layoutBegin = options.begin || 'begin'
  const layoutEnd = options.end || 'end'
  const indent = options.indent || false
  const indentSize = options.indentSize || 4
  const className = options.className || ''

  const render = options.render || renderDefault

  function findMarker(state: any, start: number, max: number, line: number) {
    // 在行内寻找marker
    let pos: number

    // 检查是否是以markerBegin起始
    // 这样可以快速过滤
    //
    if (markerBegin !== state.src.slice(start, start + 2)) {
      return false
    }

    // 在此行内寻找markerEnd
    // 需要注意，在出现markEnd之后的内容无效
    //
    let find = false
    for (pos = start + 2; pos < max; pos++) {
      if (state.src.slice(pos, pos + 2) === markerEnd) {
        find = true
        break
      }
    }
    if (!find) {
      return false
    }

    // 处理其中的内容
    //
    const dataStr = state.src.slice(start + 2, pos)
    const data = dataStr.split('|').map((item: string) => item.trim())
    const markup = markerBegin + dataStr + markerEnd
    let self = false

    // 检查data是否以layoutBegin或者layoutEnd开头
    // layoutBegin 后面必须要跟 name
    //
    let markerType: number
    if (data[0] === layoutBegin) {
      markerType = 1
      if (data[1] === name) {
        self = true
      }
    } else if (data[0] === layoutEnd) {
      markerType = -1
    } else {
      return false
    }
    // 返回marker数据
    //
    return {
      markerType,
      data,
      markup,
      line: line,
      self
    }
  }

  function findPairOfMarkers(state: any, startLine: number, endLine: number, silent: boolean) {
    // 找到一对marker
    // 要考虑到嵌套关系
    //
    let markerLevel = 0
    let line = startLine
    let markerBegin: any = null
    let markerEnd: any = null
    for (; line < endLine; line++) {
      const start = state.bMarks[line] + state.tShift[line]
      const max = state.eMarks[line]
      const marker = findMarker(state, start, max, line)
      if (marker) {
        if (marker.markerType === 1) {
          // begin
          if (markerBegin === null && marker.self) {
            markerBegin = marker

            // Since start is found, we can report success here in validation mode
            //
            if (silent) {
              return true
            }
          } else {
            if (markerBegin === null) {
              return false
            }
            markerLevel++
          }
        } else {
          // end
          if (markerLevel === 0 && markerBegin !== null) {
            // finish!
            markerEnd = marker
            break
          } else {
            markerLevel--
          }
        }
      } else {
        if (markerBegin === null) {
          return false
        } else {
          continue
        }
      }
      // console.log('marker', marker, line, markerLevel)
    }
    if (markerBegin && markerEnd) {
      return {
        markerBegin,
        markerEnd
      }
    } else {
      return false
    }
  }

  function subtractIndent(state: any, startLine: number, endLine: number) {
    // console.log('subtractIndent', state.sCount, state.bsCount, state.tShift)
    for (let i = startLine + 1; i < endLine; i++) {
      // state.sCount[i] -= indentSize
    }
    // console.log('subtractIndent --', state.sCount)
  }

  function layout(state: any, startLine: number, endLine: number, silent: boolean) {
    const markers = findPairOfMarkers(state, startLine, endLine, silent)
    if (!markers) return false
    if (markers === true) return true

    // console.log('subtractIndent', state.blkIndent, state.listIndent)
    if (indent) {
      subtractIndent(state, markers.markerBegin.line, markers.markerEnd.line)
    }

    const oldParent = state.parentType
    const oldLineMax = state.lineMax
    state.parentType = 'layout'

    // this will prevent lazy continuations from ever going past our end marker
    state.lineMax = markers.markerEnd.line

    const token_o = state.push('layout_' + name + '_open', 'div', 1)
    token_o.markup = markers.markerBegin.markup
    token_o.block = true
    token_o.meta = {
      data: markers.markerBegin.data,
      className
    }
    token_o.map = [markers.markerBegin.line, markers.markerEnd.line]
    // console.log('layout 开始', markers.markerBegin, state.level, state.blkIndent, state.listIndent)
    state.md.block.tokenize(state, startLine + 1, markers.markerEnd.line)
    const token_c = state.push('layout_' + name + '_close', 'div', -1)
    token_c.markup = markers.markerEnd.markup
    token_c.block = true
    token_c.meta = {
      data: markers.markerEnd.data
    }
    // console.log('layout 结束', markers.markerBegin, state.level)
    state.parentType = oldParent
    state.lineMax = oldLineMax
    state.line = markers.markerEnd.line + 1
    return true
  }
  md.block.ruler.before('fence', 'layout_' + name, layout, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
  md.renderer.rules['layout_' + name + '_open'] = render
  md.renderer.rules['layout_' + name + '_close'] = render
}
