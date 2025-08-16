import MarkdownItContainer from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
function initContainers(md: MarkdownIt) {
  const list = ['warning', 'tip', 'info', 'success']
  list.forEach((item) => {
    md.use(MarkdownItContainer, item, {
      render: function (tokens: Token[], idx: number) {
        if (tokens[idx].nesting === 1) {
          // opening tag
          return (
            '<div class="md-c-c md-c-c--' + item + '"><p>' + item.toLocaleUpperCase() + '</p>\n'
          )
        } else {
          // closing tag
          return '</div>\n'
        }
      }
    })
  })
}
function initMarkdownItContainer(md: MarkdownIt) {
  initContainers(md)

  md.use(MarkdownItContainer, 'details', {
    validate: function (params: any) {
      return params.trim().match(/^details\s+(.*)$/)
    },
    render: function (tokens: Token[], idx: number) {
      const m = tokens[idx].info.trim().match(/^details\s+(.*)$/)

      if (tokens[idx].nesting === 1 && m) {
        // opening tag
        return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n'
      } else {
        // closing tag
        return '</details>\n'
      }
    }
  })
  md.use(MarkdownItContainer, 'image', {
    validate: function (params: any) {
      return params.trim().match(/^image\s+(.*)$/)
    },
    render: function (tokens: Token[], idx: number) {
      // 去node_modules\markdown-it-container\index.mjs
      // 将118行复制到125行下面并且改为
      // token_c.info   = params
      //
      const m = tokens[idx].info.trim().match(/^image\s+(.*)$/)

      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<div class="md-c-img">\n'
      } else {
        // closing tag
        // 在closing tag使用info信息需要去改源码
        if (m === null) return '</div>'
        return '<span>' + (m[1] === 'null' ? '' : md.utils.escapeHtml(m[1])) + '</span></div>\n'
      }
    }
  })
}

export default [initMarkdownItContainer]
