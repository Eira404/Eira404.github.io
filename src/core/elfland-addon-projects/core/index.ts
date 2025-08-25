import { ElflandAddon } from '@/core/elfland/core/addon-base'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { Project, ProjectsDatabase } from './projects-database'
import { computed, reactive, type ComputedRef, type Reactive } from 'vue'
import type { Elfland } from '@/core/elfland/core'
import type { ProjectDataItem } from '@/core/elfland-addon-data'
import type { ElflandLangs } from '@/core/elfland/types'

export class Projects extends ElflandAddon {
  private __projectsIsGotten: boolean = false
  private __projects: Reactive<Map<ElflandLangs, ProjectsDatabase[]>> = reactive(new Map())
  private __pinnedProjects: Reactive<Map<ElflandLangs, Project[]>> = reactive(new Map())

  readonly pinnedProjects: ComputedRef<Project[]> = computed(() => this.__pinnedProjects.get(this.__elfland.i18n.getLang().value) || [])
  readonly projectsCategorySorted: ComputedRef<ProjectsDatabase[]> = computed(() => this.__projects.get(this.__elfland.i18n.getLang().value) || [])

  constructor(elfland: Elfland) {
    super(elfland)
  }

  loadedCallback(): void {
    this.__elfland.routerPromise.addCheck(this.check, this)
  }

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (this.__projectsIsGotten) return
    try {
      await this.__elfland.data.waitingDataGet
      const data = this.__elfland.data.data
      if (data === null) return
      data.projects
      this.__elfland.i18n.langList.forEach(l => {
        if (data.projects[l] === undefined) return
        this.createProjectsDatabase(l, data.projects[l])
      })
      this.__projectsIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }

  private createProjectsDatabase(lang: ElflandLangs, _projects: ProjectDataItem[]) {
    const projects = _projects.slice(2)
    const sortedData = (_projects[0] as unknown as { Sorted: string[] }).Sorted
    const sorted: ProjectsDatabase[] = []
    const pinned: Project[] = []
    sortedData.forEach(s => {
      sorted.push(new ProjectsDatabase(s))
    })
    projects.forEach(p => {
      const pins = new Project(p)
      if (p.pinned) pinned.push(pins)
      const db = sorted.find(d => d.category === p.category)
      if (!db) {
        const ndb = new ProjectsDatabase(p.category)
        ndb.addProject(pins)
        sorted.push(ndb)
      } else {
        db.addProject(pins)
      }
    })
    this.__projects.set(lang, sorted)
    this.__pinnedProjects.set(lang, pinned)
  }
}
