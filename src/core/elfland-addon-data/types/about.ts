export interface SkillDataItem {
  name: string
  details: string[]
}

export interface LinkDataItem {
  name: string
  link: string
  svg: string
  color: string
}

export interface AboutData {
  name: string
  position: string
  avater: string
  about: string[]
  github: string
  links: LinkDataItem[]
  skills: SkillDataItem[]
}
