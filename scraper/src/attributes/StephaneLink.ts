import Link from './Link';
import { join } from 'path'

export default class StephaneLink extends Link {
  public constructor(link: string, root: string) {
    super(link, root)
  }

  public normalize(link: string, root: string): string {
    const url = new URL(root)
    const strippedLink = link.replace('/../', '')

    return url.protocol + '//' + join(url.host, strippedLink)
  }
}
