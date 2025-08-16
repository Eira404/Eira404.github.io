export class Link {
  readonly id: number
  readonly path: string
  readonly title: string

  readonly in: Link[] = []
  readonly out: Link[] = []

  constructor(id: number, path: string, title: string) {
    this.id = id
    this.path = path
    this.title = title
  }
}
