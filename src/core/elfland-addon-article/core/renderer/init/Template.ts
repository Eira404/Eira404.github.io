import type MarkdownIt from 'markdown-it'
import templatePlugin from '../plugin/template'
import type Token from 'markdown-it/lib/token.mjs'
import type { MdRenderer } from '..'
function initUnderlineTemplatePlugin(md: MarkdownIt) {
  md.use(templatePlugin, 'und', {
    useIndex: true,
    configKeys: ['type'],
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      const colorDict: { [key: string]: string } = {
        default: 'transparent',
        warning: '#f89898D0',
        success: '#95d475D0',
        r: 'var(--bl-color-md-plugin-underline-r)',
        g: 'var(--bl-color-md-plugin-underline-g)',
        b: 'var(--bl-color-md-plugin-underline-b)',
        y: 'var(--bl-color-md-plugin-underline-y)'
      }
      if (token.nesting === 1) {
        const configs = token.meta.configs
        const colorType = (configs['type'] && configs['type'][0]) || 'default' // name, content, color
        const color = colorDict[colorType.trim()] || colorType.trim()
        const style = `background: linear-gradient(transparent 70%, ${color} 0%);`
        return `<span style="${style}">`
      } else {
        return '</span>'
      }
    }
  })
}

function initBackgroundTemplatePlugin(md: MarkdownIt) {
  md.use(templatePlugin, 'bgc', {
    useIndex: true,
    configKeys: ['type'],
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      const colorDict: { [key: string]: string } = {
        default: 'transparent',
        warning: '#f89898D0',
        success: '#95d475D0',
        r: 'var(--bl-color-md-plugin-underline-r)',
        g: 'var(--bl-color-md-plugin-underline-g)',
        b: 'var(--bl-color-md-plugin-underline-b)',
        y: 'var(--bl-color-md-plugin-underline-y)'
      }
      if (token.nesting === 1) {
        const configs = token.meta.configs
        const colorType = (configs['type'] && configs['type'][0]) || 'default' // name, content, color
        const color = colorDict[colorType.trim()] || colorType.trim()
        const style = `background-color: ${color};`
        return `<span style="${style}">`
      } else {
        return '</span>'
      }
    }
  })
}

function initTranslateTemplatePlugin(md: MarkdownIt) {
  md.use(templatePlugin, 'tran', {
    useIndex: true,
    configKeys: ['from', 'to'],
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      if (token.nesting === 1) {
        const name = Math.floor(Math.random() * 1000000).toString()
        const configs = token.meta.configs
        const from = (configs['from'] && configs['from'][0]) || '原文:'
        const to = (configs['to'] && configs['to'][0]) || '译文:'
        const input = `<label data-from="${from}" data-to="${to}" class="md-template-translate__label"><input type="checkbox" name="${name}" hidden ></label>`
        return '<span class="md-template-translate">' + input + '<span>'
      } else {
        return '</span></span>'
      }
    },
    renderDivision: function (token: Token[], idx: number) {
      return '</span><span>'
    },
    tokenizePos: [1, 2]
  })
}

function initObsidianLinkTemplatePlugin(md: MarkdownIt, elflandRenderer: MdRenderer) {
  md.use(templatePlugin, 'link', {
    useIndex: true,
    configKeys: ['name'],
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      if (token.nesting === 1) {
        const configs = token.meta.configs
        const name = (configs['name'] && configs['name'][0]) || 'Error'
        const path = elflandRenderer.article.getPathByTitle(name)
        const className = path === '' ? '' : 'cursor-pointer text-moonlight-500 hover:underline'
        const title = path === '' ? '' : window.location.protocol + '//' + window.location.host + '/blog/' + path
        return `<span class="${className}" md="obsidian-link" path="${path}" title=${title}>` + name
      } else {
        return '</span>'
      }
    },
    renderDivision: function (token: Token[], idx: number) {
      return '</span><span>'
    },
    tokenizePos: []
  })
}

export default [
  initUnderlineTemplatePlugin,
  initBackgroundTemplatePlugin,
  initTranslateTemplatePlugin,
  initObsidianLinkTemplatePlugin
]
