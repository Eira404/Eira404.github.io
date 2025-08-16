import type { DocDataItem } from '@/core/elfland-addon-data'
import type { Articles } from '.'
import { deepClone } from '@/core/elfland/utils'

export class Category {
  readonly category: string
  readonly child: Category | null = null
  constructor(categories: string[]) {
    this.category = categories[0] || '未分组'
    categories.shift()
    if (categories.length > 0) this.child = new Category(categories)
  }
}

export class Tag {
  readonly tag: string
  constructor(tag: string) {
    this.tag = tag
  }
}

export class Link {
  readonly id: number
  readonly title: string
  readonly path: string

  constructor(id: number, title: string, path: string) {
    this.id = id
    this.title = title
    this.path = path
  }
}

export class Article {
  readonly id: number
  readonly title: string
  readonly titlePinYin: string
  readonly path: string
  readonly time: string
  readonly author: string
  readonly body: string
  readonly categories: Category
  readonly tags: Tag[]
  readonly links: Link[]
  readonly created: Date
  readonly modified: Date
  readonly prev: {
    title: string
    path: string
  }
  readonly next: {
    title: string
    path: string
  }
  constructor(data: DocDataItem, articles: Articles) {
    data = deepClone(data)
    this.id = data.id
    this.title = data.title
    this.titlePinYin = data.titlePinYin
    this.path = data.path
    this.time = data.time
    this.author = data.author
    this.body = data.body
    this.created = new Date(data.created)
    this.modified = new Date(data.modified)
    this.categories = new Category(data.categories)
    this.tags = Array.from(new Set(data.tags)).map(t => new Tag(t))
    this.links = data.links.map(l => {
      const { id, path } = articles.getIdAndPath(l)
      return new Link(id, l, path)
    })
    const pn = articles.getPrevAndNextById(data.id)
    this.prev = pn.prev
    this.next = pn.next
  }
}
