import EventEmitter from 'eventemitter3'
import type { Router } from 'vue-router'
import i18n from '@/assets/i18n'

import { RouterPromise } from './router-promise'
import type { ElflandEvents } from '../types'
import { Theme } from '@/core/elfland-addon-theme'
import { Data } from '@/core/elfland-addon-data'
import { Articles } from '@/core/elfland-addon-articles'
import { Links } from '@/core/elfland-addon-links'
import { Article } from '@/core/elfland-addon-article'
import { Projects } from '@/core/elfland-addon-projects'
import { Tags } from '@/core/elfland-addon-tags'
import { Categories } from '@/core/elfland-addon-categories'
import { About } from '@/core/elfland-addon-about'
import { TSPlayground } from '@/core/elfland-addon-ts-playground'
import { Playground } from '@/core/elfland-addon-playground'
import { Friends } from '@/core/elfland-addon-friends'
import { ElflandI18n } from '@/core/elfland-addon-i18n'
import { Live2DShower } from '@/core/elfland-addon-live2d'
import { Selector } from '../utils'
import { MessageManager } from '@/core/elfland-addon-message-manager'

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

  readonly selector: Selector
  readonly message: MessageManager

  readonly i18n: ElflandI18n

  readonly about: About
  readonly friends: Friends
  readonly projects: Projects

  readonly data: Data
  readonly articles: Articles
  readonly article: Article
  readonly links: Links
  readonly tags: Tags
  readonly categories: Categories

  readonly playground: Playground
  readonly tsPlayground: TSPlayground

  readonly live2d: Live2DShower

  constructor(router: Router) {
    super()
    this.routerPromise = new RouterPromise(router)

    this.theme = new Theme(this)

    this.selector = new Selector()
    this.message = new MessageManager(this)

    this.i18n = new ElflandI18n(i18n, this)

    this.about = new About(this)
    this.friends = new Friends(this)
    this.projects = new Projects(this)

    this.data = new Data(this)
    this.articles = new Articles(this)
    this.article = new Article(this)
    this.links = new Links(this)
    this.tags = new Tags(this)
    this.categories = new Categories(this)

    this.playground = new Playground(this)
    this.tsPlayground = new TSPlayground(this)

    this.live2d = new Live2DShower(this)

    this.emit('loaded')
  }
}

export function useElfland() {
  return Elfland.getInstance()
}
