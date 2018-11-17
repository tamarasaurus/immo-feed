import * as path from 'path'

export default class Link {
  private value: string = null

  public constructor(link: string, root: string) {
    if (link === undefined || link === null || link.trim().length === 0) {
      return null
    }

    this.value = this.normalize(link, root)
  }

  private normalize(link: string, root: string): string {
    const url = new URL(root)

    if (!link.startsWith('http') || !link.startsWith('www')) {
      return `${url.protocol}//${path.join(url.host, link)}`
    }

    return link.trim()
  }

  public getValue(): string {
    return this.value
  }
}