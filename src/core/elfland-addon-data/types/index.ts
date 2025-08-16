import { type AboutData } from './about'

export interface DocDataItem {
  id: number
  title: string
  titlePinYin: string
  path: string
  time: string
  author: string
  body: string
  categories: string[]
  tags: string[]
  links: string[]
  created: string
  modified: string
}

export interface ProjectDataItem {
  name: string
  category: string
  author?: string
  contributors?: string[]
  role?: string
  description: string
  notes?: string
  url?: string
  github?: string
  video?: string
  arxiv?: string
  pinned?: boolean
}

export interface FriendDataItem {}

export interface DataResJson {
  docs: DocDataItem[]
  projects: ProjectDataItem[]
  about: AboutData
}
