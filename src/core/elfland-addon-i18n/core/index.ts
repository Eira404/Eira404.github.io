
import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import type { ElflandLangs } from '@/core/elfland/types'
import { localGet, localSet } from '@/core/elfland/utils'
import { ref, watch, type Ref, type WatchHandle } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'

export class ElflandI18n extends ElflandAddon {
  static readonly LANG = 'LANG'
  static readonly LANG_LIST: ElflandLangs[] = ['zh-CN', 'en-US']
  readonly i18n: I18n
  readonly langList: ElflandLangs[] = ['zh-CN', 'en-US']
  private __lang: Ref<ElflandLangs>
  private __watchFunc: WatchHandle

  constructor(messages: any, elfland: Elfland) {
    super(elfland)
    this.__lang = ref(this.getLangStr())
    this.i18n = createI18n({
      locale: this.__lang.value,
      legacy: false,
      messages: messages
    })
    this.__watchFunc = watch(this.__lang, (newLang: ElflandLangs) => {
      this.setLangStr(newLang)
    })
  }

  loadedCallback(): void {}

  private getLangStr(): ElflandLangs {
    let lang = localGet(ElflandI18n.LANG, 'en-US') || ''
    if (!ElflandI18n.LANG_LIST.includes(lang as ElflandLangs)) {
      this.setLangStr('en-US')
      lang = 'en-US'
    }
    return lang as ElflandLangs
  }

  private setLangStr(lang: ElflandLangs) {
    localSet(ElflandI18n.LANG, lang)
    this.getLocale().value = lang
  }

  getLang() {
    return this.__lang
  }

  getT() {
    const { t } = this.i18n.global
    return t as any
  }

  getLocale() {
    return this.i18n.global.locale as any
  }

  getTe() {
    const { te } = this.i18n.global
    return te
  }

  toggleLang() {
    this.__lang.value = this.__lang.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  }
}
