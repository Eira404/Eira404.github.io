export class Friend {
  readonly name: string
  readonly url: string
  readonly avater: string
  readonly desc: string

  constructor(name: string, url: string, avater: string, desc: string) {
    this.name = name
    this.url = url
    this.avater = avater
    this.desc = desc
  }
}
