import * as cheerio from 'cheerio'
import Attribute from './Attribute'
import ScrapedItem from './ScrapedItem'

export default class HTMLSite {
  public attributes: {[name: string]: Attribute}
  public itemSelector: string
  public url: string
  public $: CheerioStatic

  constructor(url: string, contents: string) {
    this.url = url
    this.$ = cheerio.load(contents)
  }

  getItemOrParentElement(item: CheerioElement, selector: string): Cheerio {
    if (selector !== undefined) {
      return this.$(selector, item)
    }

    return this.$(item)
  }

  getElementValue(item: Cheerio, attribute: string): string {
    if (attribute !== undefined) {
      return this.$(item).attr(attribute).trim()
    }

    return this.$(item).text().trim()
  }

  mapAttribute(item: CheerioElement, options: any): any {
    const { type, selector, attribute } = options
    const element = this.getItemOrParentElement(item, selector)
    const value = this.getElementValue(element, attribute)
    const typeValue = new type(value, this.url)
    return typeValue.getValue()
  }

  getMappedItems(): ScrapedItem[] {
    const scrapedItems: ScrapedItem[] = []
    const items = this.$(this.itemSelector).toArray()

    items.forEach(item => {
      const scrapedAttributes: any = {}

      Object.entries(this.attributes).forEach(([ name, options ]) => {
        scrapedAttributes[name] = this.mapAttribute(item, options)
      })

      scrapedItems.push(Object.assign(new ScrapedItem(), scrapedAttributes))
    })

    return scrapedItems
  }
}