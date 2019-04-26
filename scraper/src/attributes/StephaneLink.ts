import { join } from 'path'

export default class StephaneLink {
  private inputValue: [string, string] = null;

  public constructor(link: string, root: string) {
    this.inputValue = [link, root];
  }

  public get value(): string {
    const [link, root] = this.inputValue;
    return this.normalize([link, root]);
  }

  public normalize([link, root]: [string, string]): string {
    const url = new URL(root)
    const strippedLink = link.replace('/../', '')

    return url.protocol + '//' + join(url.host, strippedLink)
  }
}
