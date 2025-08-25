import type { Elfland } from '@/core/elfland/core'
import { ElflandAddon } from '@/core/elfland/core/addon-base'
import { DefPromiseHelper } from '@/core/elfland/core/promise-helper'
import type { RouterPromiseSyncFuncRes } from '@/core/elfland/types'
import { computed, ref, type Ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

export class TSPlayground extends ElflandAddon {
  private __tsFilesListIsGotten: boolean = false
  private __tsFilesListPromise: DefPromiseHelper = new DefPromiseHelper()
  private __tsFilesList: string[] = []
  private __tsFiles: Map<string, Record<string, string>> = new Map()
  private __selectedExample: Ref<string> = ref('def')

  get selectedExampleFiles() {
    return computed(() => {
      return this.__tsFiles.get(this.__selectedExample.value) || { '/index.ts': `console.log('Hello World')` }
    })
  }

  constructor(elfland: Elfland) {
    super(elfland)

    this.__tsFiles.set('def', {
      '/index.ts': `import { add } from './math.ts'\nimport _ from 'lodash'\nconsole.log('sum =', add(1,2))\nconsole.log('lodash version', _.VERSION)`,
      '/math.ts': `export const add = (a:number, b:number)=> a + b`
    })
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
    if (!this.is(to, 'ts-playground')) return
    if (this.__tsFilesListIsGotten) return
    try {
      await this.__elfland.data.waitingDataGet
      const data = this.__elfland.data.data
      if (data === null) return
      const list = data.tsJsonList
      this.__tsFilesList = Array.from(list)
      this.__tsFilesListPromise.resolve()
      this.__tsFilesListIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }

  private async checkQuery(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (!this.is(to, 'ts-playground')) return
    const q = to.query.example
    if (typeof q !== 'string') return
    await this.__tsFilesListPromise.promise
    if (!this.__tsFilesList.includes(q)) {
      return { name: 'ts-playground', query: {}}
    }
    if (!this.__tsFiles.has(q)) {
      const res = await fetch(`/data/ts-playground/${q}.json`)
      const json = await res.json() as { name: string, code: string}[]
      const data: Record<string, string> = {}
      json.forEach(item => {
        data['/' + item.name] = item.code
      })
      this.__tsFiles.set(q, data)
    }
  }

  private postcheck(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): RouterPromiseSyncFuncRes {
    if (!this.is(to, 'ts-playground')) return
    const q = to.query.example
    if (typeof q !== 'string') this.__selectedExample.value = 'def'
    else this.__selectedExample.value = q
  }
}
