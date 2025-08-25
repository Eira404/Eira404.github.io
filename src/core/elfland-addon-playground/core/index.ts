import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import { DefPromiseHelper } from '@/core/elfland/core/promise-helper'
import type { RouterPromiseSyncFuncRes } from '@/core/elfland/types'
import { computed, ref, type Ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import type { PlaygroundFiles } from '../types'

const defaultHTML = `<!-- Try editing me! -->
<div id="app" class="p-4">
  <h1>Hello, Playground 👋</h1>
  <button id="btn">Click me</button>
</div>`
const defaultCSS = `body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 
  \"Apple Color Emoji\", \"Segoe UI Emoji\"; padding: 16px;}
#btn{ padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;}
#btn:hover{ background:#f5f5f5; }`
const defaultJS = `console.log('Hello from JS!')
const btn = document.getElementById('btn')
btn?.addEventListener('click', ()=>{
  console.log('Button clicked at', new Date().toLocaleTimeString())
  alert('Hi from JS!')
})`
const defaultTS = `type Person = { name: string, age: number }
const p: Person = { name: 'Alice', age: 20 }
console.info('TS compiled value:', p)`

const defFiles = {
  html: {
    name: 'html',
    code: defaultHTML
  },
  css: {
    name: 'css',
    code: defaultCSS
  },
  js: {
    name: 'js',
    code: defaultJS
  },
  ts: {
    name: 'ts',
    code: defaultTS
  }
}

export class Playground extends ElflandAddon {
  private __playgroundFilesListIsGotten: boolean = false
  private __playgroundFilesListPromise: DefPromiseHelper = new DefPromiseHelper()
  private __playgroundFilesList: string[] = []
  private __playgroundFiles: Map<string, PlaygroundFiles> = new Map()
  private __selectedExample: Ref<string> = ref('def')

  get selectedExampleFiles() {
    return computed(() => {
      return this.__playgroundFiles.get(this.__selectedExample.value) || defFiles
    })
  }

  constructor(elfland: Elfland) {
    super(elfland)

    this.__playgroundFiles.set('def', defFiles)
  }

  loadedCallback(): void {
    this.__elfland.routerPromise.addCheck(this.check, this)
    this.__elfland.routerPromise.addCheck(this.checkQuery, this)
    this.__elfland.routerPromise.addPostcheck(this.postcheck, this)
  }

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (!this.is(to, 'playground')) return
    if (this.__playgroundFilesListIsGotten) return
    try {
      await this.__elfland.data.waitingDataGet
      const data = this.__elfland.data.data
      if (data === null) return
      const list = data.playgroundJsonList
      this.__playgroundFilesList = Array.from(list)
      this.__playgroundFilesListPromise.resolve()
      this.__playgroundFilesListIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }

  private async checkQuery(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (!this.is(to, 'playground')) return
    const q = to.query.example
    if (typeof q !== 'string') return
    await this.__playgroundFilesListPromise.promise
    if (!this.__playgroundFilesList.includes(q)) {
      return { name: 'playground', query: {}}
    }
    if (!this.__playgroundFiles.has(q)) {
      const res = await fetch(`/data/playground/${q}.json`)
      const json = await res.json() as { name: string, code: string, type: 'html' | 'css' | 'ts' | 'js'}[]
      const data: PlaygroundFiles = {
        html: { name: 'html', code: '' },
        css: { name: 'css', code: '' },
        ts: { name: 'ts', code: '' },
        js: { name: 'js', code: '' }
      }
      json.forEach(item => {
        if (!['html', 'css', 'ts', 'js'].includes(item.type)) return
        data[item.type].name = item.name
        data[item.type].code = item.code
      })
      this.__playgroundFiles.set(q, data)
    }
  }

  private postcheck(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): RouterPromiseSyncFuncRes {
    if (!this.is(to, 'playground')) return
    const q = to.query.example
    if (typeof q !== 'string') this.__selectedExample.value = 'def'
    else this.__selectedExample.value = q
  }
}
