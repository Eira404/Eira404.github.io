import { ElflandAddon } from '@/core/elfland/core/addon-base'
import { computed, reactive, ref, type ComputedRef, type Reactive, type Ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { Tag } from './tag'
import type { Article } from '@/core/elfland-addon-articles/core/article'
import type { RouterPromiseSyncFuncRes } from '@/core/elfland/types'
import type { Elfland } from '@/core/elfland/core'

export class Tags extends ElflandAddon {
  private __tagsIsGotten: boolean = false
  private __tags: Reactive<Map<string, Tag>> = reactive(new Map())
  private __selectedTag: Ref<string> = ref('')
  readonly sortIsAsc: Ref<boolean> = ref(false)
  readonly sortedArticels: ComputedRef<Article[]> = computed(() => {
    const tag = this.__selectedTag.value
    if (tag === '') return []
    const list = this.__tags.get(tag)
    if (!list) return []
    return list.articles.sort((a, b) => {
      if (this.sortIsAsc.value) return a.created.getTime() - b.created.getTime()
      else return b.created.getTime() - a.created.getTime()
    })
  })
  readonly tags: ComputedRef<Tag[]> = computed(() => {
    return Array.from(this.__tags.values())
  })

  constructor(elfland: Elfland) {
    super(elfland)
  }

  loadedCallback(): void {
    this.__elfland.routerPromise.addCheck(this.check, this)
    this.__elfland.routerPromise.addPostcheck(this.postcheck, this)
  }

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (this.__tagsIsGotten) return
    try {
      await this.__elfland.articles.waitingDataGet
      const articles = this.__elfland.articles.articles.value
      articles.forEach(a => {
        a.tags.forEach(t => {
          if (!this.__tags.has(t.tag)) this.__tags.set(t.tag, new Tag(t.tag))
          const tag = this.__tags.get(t.tag)!
          tag.addArticle(a)
        })
      })
      this.__tagsIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }

  private postcheck(to: RouteLocationNormalized, from: RouteLocationNormalized): RouterPromiseSyncFuncRes {
    if (!this.is(to, 'tags')) return
    const tag = to.query.tag
    this.__selectedTag.value = tag ? typeof tag === 'string' ? tag : tag[0] as string : ''
  }
}
