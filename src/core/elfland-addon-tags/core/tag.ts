import type { Article } from '@/core/elfland-addon-articles/core/article'

export class Tag {
  readonly tag: string
  readonly articles: Article[] = []

  get size() {
    return this.articles.length
  }

  constructor(tag: string) {
    this.tag = tag
  }
  addArticle(article: Article) {
    this.articles.push(article)
  }
}
