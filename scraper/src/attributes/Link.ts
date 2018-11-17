import * as $ from 'cheerio'
import * as path from 'path'

export default class Link {
  private link: string

  public constructor(link: string, root: string) {
    if (link === undefined || link === null) {
      return null
    }

    this.link = this.normalize(link, root)
  }

  private normalize(link: string, root: string): string {
    const url = new URL(root)

    if (!link.startsWith('http') || !link.startsWith('www')) {
      return `${url.protocol}//${path.join(url.host, link)}`
    }

    return link.trim()
  }

  public getValue(): string {
    return this.link
  }
}