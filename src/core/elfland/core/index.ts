import EventEmitter from 'eventemitter3'
import type { Router } from 'vue-router'

import { RouterPromise } from './router-promise'
import type { ElflandEvents } from '../types'
import { Theme } from '@/core/elfland-addon-theme'
import { Data } from '@/core/elfland-addon-data'
import { Articles } from '@/core/elfland-addon-articles'
import { Links } from '@/core/elfland-addon-links'
import { Article } from '@/core/elfland-addon-article'
import { Projects } from '@/core/elfland-addon-projects'
import { Tags } from '@/core/elfland-addon-tags/core'
import { Categories } from '@/core/elfland-addon-categories'
import { About } from '@/core/elfland-addon-about'

export class Elfland extends EventEmitter<ElflandEvents> {
  private static instance: Elfland | null = null
  static getInstance(router?: Router): Elfland {
    if (!Elfland.instance && router) {
      Elfland.instance = new Elfland(router)
    }
    return Elfland.instance as Elfland
  }

  readonly routerPromise: RouterPromise

  readonly theme: Theme

  readonly about: About

  readonly data: Data
  readonly articles: Articles
  readonly article: Article
  readonly links: Links
  readonly projects: Projects
  readonly tags: Tags
  readonly categories: Categories

  constructor(router: Router) {
    super()
    this.routerPromise = new RouterPromise(router)

    this.theme = new Theme(this)

    this.about = new About(this)

    this.data = new Data(this)
    this.articles = new Articles(this)
    this.article = new Article(this)
    this.links = new Links(this)
    this.projects = new Projects(this)
    this.tags = new Tags(this)
    this.categories = new Categories(this)
  }
}

export function useElfland() {
  return Elfland.getInstance()
}
