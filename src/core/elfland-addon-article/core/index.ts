import type { Article as ArticleDetail } from '@/core/elfland-addon-articles/core/article'
import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import type { RouterPromiseSyncFuncRes } from '@/core/elfland/types'
import { localGet, localSet, LRUCache, message } from '@/core/elfland/utils'
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { MdRenderer } from './renderer'
import type { ResTocItem } from '../types'
import Clipboard from 'clipboard'

export class Article extends ElflandAddon {
  private __path: Ref<string> = ref('')
  private __articleLRUCache: LRUCache<string, ArticleDetail> = new LRUCache(20)
  private __mdRenderer = new MdRenderer(this)
  private __mdTocString: Ref<string> = ref('')
  private __clipboard: Clipboard

  get article() {
    return computed(() => {
      return this.__articleLRUCache.get(this.__path.value) || null
    })
  }

  get renderedMd() {
    return computed(() => {
      const article = this.article.value
      if (article === null) return ''
      return this.__mdRenderer.render(article.body)
    })
  }

  get mdTocString() {
    return this.__mdTocString.value
  }

  set mdTocString(str: string) {
    this.__mdTocString.value = str
  }

  get rendererMdToc(): ComputedRef<ResTocItem[]> {
    return computed(() => {
      type TocItem = {
        l: number,
        n: string,
        c: TocItem[]
      }
      const titleMap: Map<string, number> = new Map()
      const tocString = this.__mdTocString.value
      const tocJson = JSON.parse(tocString) as TocItem
      const res: ResTocItem[] = []
      const dfs = (toc: TocItem) => {
        let title = encodeURIComponent(toc.n.trim().replace(/\ /g, '-').toLowerCase())
        if (!titleMap.has(toc.n)) titleMap.set(toc.n, 1)
        else {
          title += `-${titleMap.get(toc.n)}`
          titleMap.set(toc.n, titleMap.get(toc.n)! + 1)
        }
        const r: ResTocItem = {
          l: toc.l,
          n: toc.n.trim(),
          a: '#' + title
        }
        res.push(r)
        toc.c.forEach(n => dfs(n))
      }
      dfs(tocJson)
      res.shift()
      return res
    })
  }

  constructor(elfland: Elfland) {
    super(elfland)

    this.__clipboard = new Clipboard('.md-copy-btn')
    this.__clipboard.on('success', (e) => {
      message('复制成功', 'success')
    })
    this.__clipboard.on('error', (e) => {
      message('复制失败')
    })
  }

  loadedCallback(): void {
    this.__elfland.routerPromise.addCheck(this.check, this)
    this.__elfland.routerPromise.addPostcheck(this.postcheck, this)
    this.__elfland.selector.addSelectorList([
      ['click', '.markdown-body span[md="codeScroll"]', 'clickCodeScroll', { childrenEvent: true }],
      ['touchstart', '.markdown-body span[md="codeScroll"]', 'clickCodeScroll', { childrenEvent: true }],
      ['click', '.markdown-body span[md="obsidian-link"]', 'clickObsidianLink', { childrenEvent: true }],
      ['touchstart', '.markdown-body span[md="obsidian-link"]', 'clickObsidianLink', { childrenEvent: true }],
      ['click', '.markdown-body span[md="playground"]', 'clickPlayground', { childrenEvent: true }],
      ['touchstart', '.markdown-body span[md="playground"]', 'clickPlayground', { childrenEvent: true }]
    ])
    this.__elfland.selector.on('clickCodeScroll', (e) => {
      const codeScroll = localGet(MdRenderer.CODE_SCROLL_KEY, false) === 'true'
      localSet(MdRenderer.CODE_SCROLL_KEY, !codeScroll)
      const eles = document.querySelectorAll('.markdown-body span[md="codeScroll"]')
      for (let i = 0; i < eles.length; i++) {
        if (codeScroll) eles[i].removeAttribute('checked')
        else eles[i].setAttribute('checked', '')
      }
    })
    this.__elfland.selector.on('clickObsidianLink', (e) => {
      const ele = e.element
      const path = ele.getAttribute('path')
      if (path === '') return
      if (typeof path !== 'string') return
      window.scrollTo(0, 0)
      this.__elfland.routerPromise.router.push(path)
    })
    this.__elfland.selector.on('clickPlayground', (e) => {
      const ele = e.element
      const code = ele.getAttribute('data-example-code')
      const id = ele.getAttribute('data-example-id')
      switch (code) {
        case 'html':
          this.__elfland.routerPromise.router.push({ name: 'playground', query: { example: id }})
          break
        case 'ts':
          this.__elfland.routerPromise.router.push({ name: 'ts-playground', query: { example: id }})
          break
      }
    })
  }

  getPathByTitle(title: string) {
    const art = this.__elfland.articles.getIdAndPath(title)
    return art.path
  }

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (!this.is(to, 'article')) return
    const path = to.params.articlePath
    if (typeof path !== 'string') return { name: '404' }
    await this.__elfland.articles.waitingDataGet
    const art = this.__elfland.articles.getArticleByPath(path)
    if (art === null) return { name: '404' }
    this.__articleLRUCache.set(path, art)
  }

  private postcheck(to: RouteLocationNormalized, from: RouteLocationNormalized): RouterPromiseSyncFuncRes {
    if (!this.is(to, 'article')) return
    const path = to.params.articlePath
    if (typeof path !== 'string') return
    this.__path.value = path
  }
}
