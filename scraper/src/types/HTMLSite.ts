import * as cheerio from 'cheerio'
import Attribute, { DataAttribute } from './Attribute'
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

  getElementValue(element: Cheerio, attribute: string): string {
    if (attribute !== undefined) {
      return this.$(element).attr(attribute).trim()
    }

    return this.$(element).text().trim()
  }

  getElementDataAttributeKeyValue(element: Cheerio, { name, key }: DataAttribute): string | null {
    const value = this.$(element).data(name)

    if (name !== undefined && key !== undefined ) {
      try {
        return value[key]
      } catch (e) {
        return null
      }
    }

    return value
  }

  mapAttribute(item: CheerioElement, options: any): any {
    const { type, selector, attribute, data } = options

    const element = this.getItemOrParentElement(item, selector)
    let value = this.getElementValue(element, attribute)

    if (data !== undefined) {
      return this.getElementDataAttributeKeyValue(element, data)
    }

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