import MarkdownItFootnote from 'markdown-it-footnote'
function initMarkdownItFootnote(md: MarkdownIt) {
  md.use(MarkdownItFootnote)
}

import MarkdownItAbbr from 'markdown-it-abbr'
function initMarkdownItAbbr(md: MarkdownIt) {
  md.use(MarkdownItAbbr)
}

import MarkdownItSub from 'markdown-it-sub'
function initMarkdownItSub(md: MarkdownIt) {
  md.use(MarkdownItSub)
}
import MarkdownItSup from 'markdown-it-sup'
function initMarkdownItSup(md: MarkdownIt) {
  md.use(MarkdownItSup)
}

// import MarkdownItTextualUml from 'markdown-it-textual-uml'
// function initMarkdownItTextualUml(md) {
//   md.use(MarkdownItTextualUml)
// }

import { plantuml } from '@mdit/plugin-plantuml'
import type MarkdownIt from 'markdown-it'
function initMarkdownItPlantuml(md: MarkdownIt) {
  md.use(plantuml)
}

export default [
  initMarkdownItFootnote,
  initMarkdownItAbbr,
  initMarkdownItSub,
  initMarkdownItSup,
  initMarkdownItPlantuml
]
