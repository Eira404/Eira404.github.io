import type { AboutData, LinkDataItem, SkillDataItem } from '@/core/elfland-addon-data/types/about'

export class AboutItem {
  readonly name: string
  readonly position: string
  readonly avater: string
  readonly about: string[]
  readonly github: string

  readonly links: LinkDataItem[] = []
  readonly skills: SkillDataItem[] = []

  constructor(data: AboutData) {
    this.name = data.name
    this.position = data.position
    this.avater = data.avater
    this.about = data.about
    this.github = data.github

    data.links.forEach(l => {
      this.links.push(l)
    })

    data.skills.forEach(s => {
      this.skills.push(s)
    })
  }
}
