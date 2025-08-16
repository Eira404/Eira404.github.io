import { ElflandAddon } from '@/core/elfland/core/addon-base'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { Category } from './category'
import { computed, reactive, ref, type ComputedRef, type Reactive, type Ref } from 'vue'
import type { Article } from '@/core/elfland-addon-articles/core/article'
import type { RouterPromiseSyncFuncRes } from '@/core/elfland/types'
import type { Elfland } from '@/core/elfland/core'

export class Categories extends ElflandAddon {
  private __categoriesIsGotten: boolean = false
  private __category: Reactive<Category> = reactive(new Category())

  private __selcetedCategory: Ref<string> = ref('')
  private __displayArticlesList: ComputedRef<Article[]> = computed(() => {
    if (this.__selcetedCategory.value === '') return []
    const cates = this.__selcetedCategory.value.split('/').filter(c => c !== '')
    let res: Article[] = []
    let cate: Category | undefined = this.__category
    while (cates.length > 0) {
      cate = cate.children.get(cates.shift() || '')
      if (!cate) return []
      res = cate.allArts
    }
    return res
  })
  get categories(): Category[] {
    return this.__category.categories.sort((a, b) => a.category === '未分组' ? 1 : -1)
  }
  readonly sortIsAsc: Ref<boolean> = ref(false)
  readonly sortedArticels: ComputedRef<Article[]> = computed(() => {
    return this.__displayArticlesList.value.sort((a, b) => {
      if (this.sortIsAsc.value) return a.created.getTime() - b.created.getTime()
      else return b.created.getTime() - a.created.getTime()
    })
  })

  constructor(elfland: Elfland) {
    super(elfland)

    elfland.routerPromise.addCheck(this.check, this)
    elfland.routerPromise.addPostcheck(this.postcheck, this)
  }

  logoutCallback(): void {}

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (this.__categoriesIsGotten) return
    try {
      await this.__elfland.articles.waitingDataGet
      const articles = this.__elfland.articles.articles.value
      articles.forEach(a => {
        this.__category.addArticle(a, a.categories)
      })
      this.__categoriesIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }

  private postcheck(to: RouteLocationNormalized, from: RouteLocationNormalized): RouterPromiseSyncFuncRes {
    if (!this.is(to, 'categories')) return
    const category = to.query.category
    this.__selcetedCategory.value = category ? typeof category === 'string' ? category : category[0] as string : ''
    if (this.__selcetedCategory.value === '') return
    const cates = this.__selcetedCategory.value.split('/').filter(c => c !== '')
    let cate: Category | undefined = this.__category
    while (cates.length > 0) {
      cate = cate.children.get(cates.shift() || '')
      if (!cate) return
      cate.fold = false
    }
  }
}
