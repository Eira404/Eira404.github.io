import type MarkdownIt from 'markdown-it'
import templatePlugin from '../plugin/template'
import type Token from 'markdown-it/lib/token.mjs'
import type { MdRenderer } from '..'

function initTemplateTestPlugin1(md: MarkdownIt, elflandRenderer: MdRenderer) {
  md.use(templatePlugin, 'template-name-1', {
    configKeys: ['type'],
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      const colorDict: Record<string, string> = {
        default: 'transparent',
        warning: '#F56C6C',
        success: '#67C23A'
      }
      if (token.nesting === 1) {
      // opening tag
        const configs = token.meta.configs
        // 用户配置项
        console.log('template-name-1 configs', configs)
        const colorType = (configs['type'] && configs['type'][0]) || 'default'
        const color = colorDict[colorType.trim()] || colorType.trim()
        const style = `background-color: ${color};`
        return `<span style="${style}">`
      } else {
      // closing tag
        return '</span>'
      }
    }
  })
}

function initTemplateTestPlugin2(md: MarkdownIt, elflandRenderer: MdRenderer) {
  md.use(templatePlugin, 'template-name-2', {
    configKeys: ['chars', 'color'],
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      if (token.nesting === 1) {
      // opening tag
        const configs = token.meta.configs
        console.log('template-name-2 configs', configs)
        const charsConf = (configs['chars']) || []
        const color = (configs['color']) || ''
        const chars = charsConf.join('-')
        return `<span style="color: ${color}">${chars}`
      } else {
      // closing tag
        return '</span>'
      }
    }
  })
}

function initTemplateTestPlugin3(md: MarkdownIt, elflandRenderer: MdRenderer) {
  md.use(templatePlugin, 'template-name-3', {
    configKeys: ['chars', 'color'],
    useIndex: true,
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      if (token.nesting === 1) {
      // opening tag
        const configs = token.meta.configs
        console.log('template-name-3 configs', configs)
        const charsConf = (configs['chars']) || []
        const color = (configs['color']) || ''
        const chars = charsConf.join('-')
        return `<span style="color: ${color}">${chars}`
      } else {
      // closing tag
        return '</span>'
      }
    }
  })
}

function initTemplateTestPlugin4(md: MarkdownIt, elflandRenderer: MdRenderer) {
  md.use(templatePlugin, 'template-name-4', {
    configKeys: ['chars', 'color'],
    tokenizePos: [], // 全部禁止解析
    useIndex: true,
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      if (token.nesting === 1) {
      // opening tag
        const configs = token.meta.configs
        console.log('template-name-4 configs', configs)
        const charsConf = (configs['chars']) || []
        const color = (configs['color']) || ''
        const chars = charsConf.join('-')
        return `<span style="color: ${color}">${chars}`
      } else {
      // closing tag
        return '</span>'
      }
    }
  })
}

export default [
  initTemplateTestPlugin1,
  initTemplateTestPlugin2,
  initTemplateTestPlugin3,
  initTemplateTestPlugin4
]
