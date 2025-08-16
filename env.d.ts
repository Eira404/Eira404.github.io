/// <reference types="vite/client" />

/// <reference types="jsdom" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}

declare module 'nprogress'
declare module 'markdown-it-container'
declare module 'markdown-it-emoji'
declare module 'markdown-it-katex'
declare module 'markdown-it-footnote'
declare module 'markdown-it-abbr'
declare module 'markdown-it-sub'
declare module 'markdown-it-sup'
declare module '@mdit/plugin-plantuml'
declare module 'highlightjs-vue'
