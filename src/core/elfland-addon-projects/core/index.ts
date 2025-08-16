import { ElflandAddon } from '@/core/elfland/core/addon-base'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { Project, ProjectsDatabase } from './projects-database'
import { computed, reactive, type ComputedRef, type Reactive } from 'vue'
import type { Elfland } from '@/core/elfland/core'

export class Projects extends ElflandAddon {
  private __projectsIsGotten: boolean = false
  private __projectsCategorySorted: Reactive<ProjectsDatabase[]> = reactive([])
  private __pinnedProjects: Reactive<Project[]> = reactive([])

  readonly pinnedProjects: ComputedRef<Project[]> = computed(() => this.__pinnedProjects)
  readonly projectsCategorySorted: ComputedRef<ProjectsDatabase[]> = computed(() => this.__projectsCategorySorted)

  constructor(elfland: Elfland) {
    super(elfland)

    elfland.routerPromise.addCheck(this.check, this)
  }

  logoutCallback(): void {}

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (this.__projectsIsGotten) return
    try {
      await this.__elfland.data.waitingDataGet
      const data = this.__elfland.data.data
      if (data === null) return
      const projects = data.projects.slice(2)
      const sortedData = (data.projects[0] as unknown as { Sorted: string[] }).Sorted
      sortedData.forEach(s => {
        this.__projectsCategorySorted.push(new ProjectsDatabase(s))
      })
      projects.forEach(p => {
        const pins = new Project(p)
        if (p.pinned) this.__pinnedProjects.push(pins)
        const db = this.__projectsCategorySorted.find(d => d.category === p.category)
        if (!db) {
          const ndb = new ProjectsDatabase(p.category)
          ndb.addProject(pins)
          this.__projectsCategorySorted.push(ndb)
        } else {
          db.addProject(pins)
        }
      })
      this.__projectsIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }
}
