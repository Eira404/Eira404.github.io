import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import type { Options } from 'markdown-it'
import type Renderer from 'markdown-it/lib/renderer.mjs'

function initImage(md: MarkdownIt, elflandRenderer: any, meta: any) {
  const baseUrl = meta ? meta.baseUrl || '' : ''
  const defaultImage = md.renderer.rules.image
  function image(tokens: Token[], idx: number, options: Options, env: any, slf: Renderer) {
    const url = tokens[idx].attrGet('src') || ''
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('data:image') ||
      url.startsWith('file://') ||
      url.startsWith('blob:')
    ) {
      if (defaultImage === undefined) return ''
      return defaultImage(tokens, idx, options, env, slf)
    } else {
      tokens[idx].attrSet('src', baseUrl + '/data/assets/' + url)
      if (defaultImage === undefined) return ''
      return defaultImage(tokens, idx, options, env, slf)
    }
  }
  md.renderer.rules.image = image
}

export default [initImage]
