import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import componentPlugin from '../plugin/component'
import type { ComponentPluginOptions } from '../plugin/component'
function initClassifyComponentPlugin(md: MarkdownIt) {
  md.use(componentPlugin, 'classify', {
    render: function (tokens: Token[], idx: number) {
      const token = tokens[idx]
      if (token.nesting === 1) {
        const name = Math.floor(Math.random() * 1000000).toString()
        const configs = token.meta.configs
        const classifies = configs.classifies || []
        let inputs = ''
        classifies.forEach((c: string, i: number) => {
          const t =
            '<div><label><input type="radio" name="' +
            name +
            '" value="' +
            i.toString() +
            '" hidden ' +
            (i === 0 ? 'checked' : '') +
            '> ' +
            c +
            '</label></div>'
          inputs += t
        })
        // opening tag
        return (
          '<div class="markdown-it-component-classify-container">\n<div class="markdown-it-component-classify">\n<div head>\n' +
          inputs +
          '\n</div>\n<div body>\n<div>\n'
        )
      } else {
        // closing tag
        return '</div>\n</div>\n</div>\n</div>\n'
      }
    },
    renderDivision: function (tokens: Token[], idx: number) {
      return '</div>\n<div>\n'
    },
    init: function (options: ComponentPluginOptions) {
      const size = 10
      const styleId = 'markdown-it-classify-style'
      let styleBase = `
.markdown-it-component-classify-container {
  border-radius: 8px;
  border: 1px solid var(--bl-color-base-border);
  overflow: hidden;
  margin-bottom: 1rem;
}
.markdown-it-component-classify > div > div {
  position: relative;
}
.markdown-it-component-classify > div[body] > div {
  display: none;
  padding: 0.5rem;
}
.markdown-it-component-classify > div[head] {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--bl-color-light-fill);
}
.markdown-it-component-classify > div[head] > div > label {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: color 0.2s;
  box-sizing: border-box;
  display: block;
  font-weight: bold;
  color: var(--bl-color-secondary-text);
}
.markdown-it-component-classify > div[head] > div:nth-child(n + 2)::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 1px;
  height: 40%;
  background-color: var(--bl-color-primary-text);
}
.markdown-it-component-classify > div[head] > div > label:has(input:checked) {
  transition: color 0.2s;
  color: var(--bl-color-primary-text);
}
.markdown-it-component-classify > div[head] > div > label:hover {
  transition: color 0.2s;
  color: var(--bl-color-primary-text);
}
.markdown-it-component-classify > div[body] > div > *:last-child {
  margin-bottom: 0 !important;
}

      `
      for (let i = 1; i <= size; i++) {
        if (i > 1) styleBase += ',\n'
        styleBase += `.markdown-it-component-classify:has( > div[head] > div:nth-child(${i}) > label > input:checked) > div[body] > div:nth-child(${i})`
      }
      styleBase += ` {
  display: block;
}
      `
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.setAttribute('id', styleId)
        style.setAttribute('type', 'text/css')
        style.innerHTML = styleBase.trim()
        const head = document.head || document.getElementsByTagName('head')[0]
        head.appendChild(style)
      }
    },
    configKeys: ['classifies']
  })
}

export default [initClassifyComponentPlugin]
