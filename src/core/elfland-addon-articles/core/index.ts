import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import { DefPromiseHelper } from '@/core/elfland/core/promise-helper'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { Article } from './article'
import { computed, reactive, ref, type ComputedRef, type Reactive, type Ref, type WritableComputedRef } from 'vue'
import { type ArchivesSortMethod } from '../types'

export class Articles extends ElflandAddon {
  private __articlesIsGotten: boolean = false
  private __articlesPromise: DefPromiseHelper = new DefPromiseHelper()

  private __id2article: Reactive<Map<number, Article>> = reactive(new Map())
  private __id2path: Map<number, string> = new Map()
  private __path2id: Map<string, number> = new Map()
  private __id2title: Map<number, string> = new Map()
  private __title2id: Map<string, number> = new Map()
  private __articles: ComputedRef<Article[]> = computed(() => {
    const list = Array.from(this.__id2article.values())
    list.sort((a, b) => b.created.getTime() - a.created.getTime())
    return list
  })
  readonly archivesSortMethodSelected: Ref<ArchivesSortMethod> = ref('ByCreated')
  readonly archivesSortMethodOptions: ComputedRef<ArchivesSortMethod[]> = computed(() => {
    return [
      'ByCreated',
      'ByModified',
      'ByTitlePinYin'
    ]
  })
  private __sortMethodIsAsc: Reactive<Record<ArchivesSortMethod, boolean>> = reactive({
    ByCreated: false,
    ByModified: false,
    ByTitlePinYin: true
  })
  readonly archivesSortMethodIsAsc: WritableComputedRef<boolean, boolean> = computed({
    get: () => this.__sortMethodIsAsc[this.archivesSortMethodSelected.value],
    set: (val) => {
      this.__sortMethodIsAsc[this.archivesSortMethodSelected.value] = val
    }
  })
  readonly sortedArchives: ComputedRef<Article[]> = computed(() => {
    const list = Array.from(this.__id2article.values())
    list.sort((a, b) => {
      switch (this.archivesSortMethodSelected.value) {
        case 'ByCreated':
          return this.archivesSortMethodIsAsc.value ? a.created.getTime() - b.created.getTime() : b.created.getTime() - a.created.getTime()
        case 'ByModified':
          return this.archivesSortMethodIsAsc.value ? a.modified.getTime() - b.modified.getTime() : b.modified.getTime() - a.modified.getTime()
        case 'ByTitlePinYin':
          return this.archivesSortMethodIsAsc.value ? a.titlePinYin.localeCompare(b.titlePinYin) : b.titlePinYin.localeCompare(a.titlePinYin)
      }
    })
    return list
  })

  get articles() {
    return this.__articles
  }

  get waitingDataGet() {
    return this.__articlesPromise.promise
  }

  constructor(elfland: Elfland) {
    super(elfland)

    elfland.routerPromise.addCheck(this.check, this)
  }

  logoutCallback(): void {}

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (this.__articlesIsGotten) return
    try {
      await this.__elfland.data.waitingDataGet
      const data = this.__elfland.data.data
      if (data === null) return
      data.docs.forEach(d => {
        this.__id2path.set(d.id, d.path)
        this.__path2id.set(d.path, d.id)
        this.__id2title.set(d.id, d.title)
        this.__title2id.set(d.title, d.id)
      })
      data.docs.forEach(d => {
        this.__id2article.set(d.id, new Article(d, this))
      })
      this.__articlesIsGotten = true
      this.__articlesPromise.resolve()
    } catch (e) {
      console.error(e)
    }
  }

  getIdAndPath(title: string): { id: number, path: string } {
    const id = this.__title2id.get(title) || -1
    const path = this.__id2path.get(id) || ''
    return { id, path }
  }

  getPrevAndNextById(id: number): { prev: { path: string, title: string }, next: { path: string, title: string }} {
    const list = Array.from(this.__id2path.keys())
    const i = list.indexOf(id)
    if (i === -1) return { prev: { path: '', title: '' }, next: { path: '', title: '' }}
    const pi = i - 1 < 0 ? list.length - 1 : i - 1
    const ni = i + 1 >= list.length ? 0 : i + 1
    const pid = list[pi]
    const nid = list[ni]
    const prev = {
      path: this.__id2path.get(pid) as string,
      title: this.__id2title.get(pid) as string
    }
    const next = {
      path: this.__id2path.get(nid) as string,
      title: this.__id2title.get(nid) as string
    }
    return { prev, next }
  }

  getArticleByPath(path: string): Article | null {
    const id = this.__path2id.get(path)
    if (id === undefined) return null
    const art = this.__id2article.get(id)
    if (art === undefined) return null
    return art
  }
}
