import type { Article, Category as ArticleCategory } from '@/core/elfland-addon-articles/core/article'

export class Category {
  readonly category: string
  readonly children: Map<string, Category> = new Map()
  readonly allArts: Article[] = []
  readonly selfArts: Article[] = []
  readonly parent: Category | null = null

  fold: boolean = true

  get categories(): Category[] {
    return Array.from(this.children.values())
  }

  get path(): string {
    if (this.category === 'ROOT' || this.parent === null) return ''
    return this.parent.path + '/' + this.category
  }

  constructor(category?: string, parent?: Category) {
    this.category = category || 'ROOT'
    this.parent = parent || null
  }

  addArticle(art: Article, cate: ArticleCategory) {
    this.allArts.push(art)
    const category = cate.category
    if (!this.children.has(category)) this.children.set(category, new Category(category, this))
    const categoryIns = this.children.get(category) as Category
    if (cate.child === null) {
      categoryIns.allArts.push(art)
      categoryIns.selfArts.push(art)
    } else {
      categoryIns.addArticle(art, cate.child)
    }
  }
}
