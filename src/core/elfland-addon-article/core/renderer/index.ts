import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import init from './init'
import { generateRandomStringBase, localGet } from '@/core/elfland/utils'
import type { Article } from '..'

import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import c from 'highlight.js/lib/languages/c'
import cmake from 'highlight.js/lib/languages/cmake'
import cpp from 'highlight.js/lib/languages/cpp'
import markdown from 'highlight.js/lib/languages/markdown'
import json from 'highlight.js/lib/languages/json'
import latex from 'highlight.js/lib/languages/latex'
import python from 'highlight.js/lib/languages/python'
import yaml from 'highlight.js/lib/languages/yaml'
import hljsDefineVue from 'highlightjs-vue'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('c', c)
hljs.registerLanguage('cmake', cmake)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('json', json)
hljs.registerLanguage('latex', latex)
hljs.registerLanguage('python', python)
hljs.registerLanguage('yaml', yaml)
hljsDefineVue(hljs)
hljs.registerLanguage('html', xml)

export class MdRenderer {
  static readonly CODE_SCROLL_KEY = 'md-code-scroll'
  private md: MarkdownIt
  readonly article: Article
  private generateRandomString = generateRandomStringBase()

  private codeScroll = localGet(MdRenderer.CODE_SCROLL_KEY, false) === 'true'
  private svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ><path fill="currentColor" d="M128 320v576h576V320zm-32-64h640a32 32 0 0 1 32 32v640a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V288a32 32 0 0 1 32-32M960 96v704a32 32 0 0 1-32 32h-96v-64h64V128H384v64h-64V96a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32M256 672h320v64H256zm0-192h320v64H256z"></path></svg>'
  private svgCodeScroll =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ><path fill="currentColor" d="M511.552 128c-35.584 0-64.384 28.8-64.384 64.448v516.48L274.048 570.88a94.272 94.272 0 0 0-112.896-3.456 44.416 44.416 0 0 0-8.96 62.208L332.8 870.4A64 64 0 0 0 384 896h512V575.232a64 64 0 0 0-45.632-61.312l-205.952-61.76A96 96 0 0 1 576 360.192V192.448C576 156.8 547.2 128 511.552 128M359.04 556.8l24.128 19.2V192.448a128.448 128.448 0 1 1 256.832 0v167.744a32 32 0 0 0 22.784 30.656l206.016 61.76A128 128 0 0 1 960 575.232V896a64 64 0 0 1-64 64H384a128 128 0 0 1-102.4-51.2L101.056 668.032A108.416 108.416 0 0 1 128 512.512a158.272 158.272 0 0 1 185.984 8.32z"></path></svg>'

  constructor(article: Article) {
    this.article = article
    this.md = new MarkdownIt({
      breaks: true,
      linkify: true,
      highlight: (str, lang) => {
        lang = lang.trim()
        const spaceI = lang.indexOf(':')
        const detail = spaceI === -1 ? '' : lang.slice(spaceI + 1)
        lang = spaceI === -1 ? lang : lang.slice(0, spaceI)
        const codeIndex = this.generateRandomString()
        const button = `<span class="md-code-btn md-copy-btn select-none" title="点击复制" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">${this.svg}</span>`
        const codeScroll = `<span class="md-code-btn select-none" md="codeScroll" title="调整代码块最大高度" ${this.codeScroll ? 'checked' : ''}>${this.svgCodeScroll}</span>`
        const showLang = '<span>' + this.getLang(lang) + '</span>'
        const showDetail = `<span>${detail}</span>`
        const code = this.md.utils.escapeHtml(str)
        let codeHtml = code
        if (lang && hljs.getLanguage(lang)) {
          try {
            codeHtml = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          } catch (_) {
            //
          }
        }

        const headLeft = `<div>${showLang}${showDetail}</div>`
        const headRight = `<div>${codeScroll}${button}</div>`

        const codeLable = `<pre class="hljs">${codeHtml}<code></code></pre>`
        const headLabel = `<div>${headLeft}${headRight}</div>`
        const copyCode = `<textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${code}</textarea>`

        const codeAll = `<div class="hljs-container">${headLabel}${codeLable}${copyCode}</div>`
        //
        // 使用div开头，需要去markdown-it源代码中修改
        // node_modules\markdown-it\lib\renderer.mjs
        // 48行 改为：if (highlighted.indexOf('<pre') === 0 || highlighted.indexOf('<div') === 0)
        //
        return codeAll
      }
    })
    this.init()
  }

  /**
   * md to html
   * @param str md文档字符串
   * @returns md解析出来的结果
   */
  render(str: string) {
    function scrollToHash() {
      const hash = location.hash.slice(1)   // 去掉 #
      if (!hash) return

      // 等渲染完成，保险起见用 nextTick / setTimeout
      requestAnimationFrame(() => {
        const el = document.getElementById(hash) || document.querySelector(`[id="${hash}"]`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
    scrollToHash()
    return this.md.render(str)
  }

  private getLang(lang: string) {
    lang = lang || ''
    if (lang === '') return lang
    // lang = lang.toLocaleLowerCase()
    // lang = lang.slice(0, 1).toLocaleUpperCase() + lang.slice(1)
    const dict: { [property: string]: string } = {
      // Javascript: 'JS',
      // Js: 'JS',
      // Css: 'CSS',
      // Md: 'markdown',
      // Cpp: 'CPP'
    }
    return dict[lang] || lang
  }

  private init() {
    init(this.md, this, {
      baseUrl: window.location.protocol + '//' + window.location.host
    })
  }

  renderToc(tocHtml: any, ast: any) {
    this.article.mdTocString = JSON.stringify(ast)
    // console.log('renderToc', tocHtml, ast)
  }
}
