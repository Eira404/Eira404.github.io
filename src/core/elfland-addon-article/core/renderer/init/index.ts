import Container from './Container'
import EmojiAnchorTocKatex from './EmojiAnchorTocKatex'
import FootnoteAbbrSubSupUml from './FootnoteAbbrSubSupUml'
import Image from './Image'
import Layout from './Layout'
import Component from './Component'
import Template from './Template'

import TemplateForTest from './TemplateForTest'

import type MarkdownIt from 'markdown-it'

const plugins = [
  ...Container,
  ...EmojiAnchorTocKatex,
  ...FootnoteAbbrSubSupUml,
  ...Image,
  ...Layout,
  ...Component,
  ...Template,

  ...TemplateForTest
]

export default function init(md: MarkdownIt, elflandRenderer: any, meta: any) {
  plugins.forEach((func) => {
    func(md, elflandRenderer, meta)
  })
}
