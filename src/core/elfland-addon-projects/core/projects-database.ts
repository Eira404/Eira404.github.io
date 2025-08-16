import type { ProjectDataItem } from '@/core/elfland-addon-data'

export class Project {
  readonly name: string
  readonly category: string
  readonly author?: string
  readonly contributors?: string[]
  readonly role?: string
  readonly description: string
  readonly notes?: string
  readonly url?: string
  readonly github?: string
  readonly video?: string
  readonly arxiv?: string

  constructor(data: ProjectDataItem) {
    this.name = data.name
    this.category = data.category
    this.author = data.author
    this.contributors = data.contributors
    this.role = data.role
    this.description = data.description
    this.notes = data.notes
    this.url = data.url
    this.github = data.github
    this.video = data.video
    this.arxiv = data.arxiv
  }
}

export class ProjectsDatabase {
  readonly category: string
  readonly projects: Project[]  = []

  constructor(category: string) {
    this.category = category
  }

  addProject(project: Project) {
    this.projects.push(project)
  }
}
