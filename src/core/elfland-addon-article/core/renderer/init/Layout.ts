import type MarkdownIt from 'markdown-it'
import LayoutPlugin from '../plugin/layout'
import type Token from 'markdown-it/lib/token.mjs'
function initLayoutPlugin(md: MarkdownIt) {
  md.use(LayoutPlugin, 'container', {
    className: 'md-layout-c',
    render: function (tokens: Token[], idx: number) {
      const ALLOW_STYLE_ATTR = [
        ['w', 'width'],
        ['h', 'height'],
        ['style', 'style'],
        ['class', 'class']
      ]

      if (tokens[idx].nesting === 1) {
        let styleStr = ''
        let classStr = tokens[idx].meta.className + ' '
        tokens[idx].meta.data.forEach((data: any) => {
          const key = data.split('=')[0]
          const left = data.indexOf('=')
          const value = data.slice(left + 1, data.length)
          const item = ALLOW_STYLE_ATTR.find((i) => i[0] === key)
          if (item) {
            if (item[1] === 'style') {
              styleStr += value
            } else if (item[1] === 'class') {
              classStr += value
            } else {
              styleStr += item[1] + ':' + value + ';'
            }
          }
        })
        // opening tag
        return '<div class="' + (classStr === ' ' ? '' : classStr) + '" style="' + styleStr + '">\n'
      } else {
        // closing tag
        return '</div>\n'
      }
    }
  })
  md.use(LayoutPlugin, 'item', {
    className: 'md-layout-i',
    render: function (tokens: Token[], idx: number) {
      const ALLOW_STYLE_ATTR = [
        ['w', 'width'],
        ['h', 'height'],
        ['style', 'style'],
        ['class', 'class']
      ]

      if (tokens[idx].nesting === 1) {
        let styleStr = ''
        let classStr = tokens[idx].meta.className + ' '
        tokens[idx].meta.data.forEach((data: any) => {
          const key = data.split('=')[0]
          const left = data.indexOf('=')
          const value = data.slice(left + 1, data.length)
          const item = ALLOW_STYLE_ATTR.find((i) => i[0] === key)
          if (item) {
            if (item[1] === 'style') {
              styleStr += value
            } else if (item[1] === 'class') {
              classStr += value
            } else {
              styleStr += item[1] + ':' + value + ';'
            }
          }
        })
        // opening tag
        return '<div class="' + (classStr === ' ' ? '' : classStr) + '" style="' + styleStr + '">\n'
      } else {
        // closing tag
        return '</div>\n'
      }
    }
  })
}

export default [initLayoutPlugin]
