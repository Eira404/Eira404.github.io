import { full as MarkdownItEmoji } from 'markdown-it-emoji'
function initMarkdownItEmoji(md: MarkdownIt) {
  md.use(MarkdownItEmoji)
}

import MarkdownItAnchor from 'markdown-it-anchor'
function initMarkdownItAnchor(md: MarkdownIt) {
  md.use(MarkdownItAnchor, {
    permalink: MarkdownItAnchor.permalink.linkInsideHeader({
      placement: 'before'
    })
  })
}

import MarkdownItTocDoneRight from 'markdown-it-toc-done-right'
function initMarkdownItTocDoneRight(md: MarkdownIt, elflandRenderer: any) {
  md.use(MarkdownItTocDoneRight, {
    listType: 'ul',
    level: [1],
    callback: (html: any, ast: any) => {
      elflandRenderer.renderToc(html, ast)
    }
  })
}

import MarkdownItKatex from 'markdown-it-katex'
import type MarkdownIt from 'markdown-it'
function initMarkdownItKatex(md: MarkdownIt) {
  md.use(MarkdownItKatex, {
    throwOnError: false,
    errorColor: '#cc0000'
  })
}

export default [
  initMarkdownItEmoji,
  initMarkdownItAnchor,
  initMarkdownItTocDoneRight,
  initMarkdownItKatex
]
