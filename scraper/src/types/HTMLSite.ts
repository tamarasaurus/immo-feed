import * as cheerio from 'cheerio'
import Attribute, { DataAttribute } from './Attribute'
import ScrapedItem from './ScrapedItem'

interface Site {
  attributes: {[name: string]: Attribute}
  itemSelector: 'string'
  load: boolean
}

export default class HTMLSite {
  public attributes: {[name: string]: Attribute}
  public itemSelector: string
  public url: string
  public $: CheerioStatic

  constructor(site: Site, url: string, contents: string) {
    this.url = url
    this.attributes = site.attributes
    this.itemSelector = site.itemSelector
    this.$ = cheerio.load(contents)
  }

  public getItemOrParentElement(item: CheerioElement, selector: string): Cheerio {
    if (selector !== undefined) {
      return this.$(selector, item)
    }

    return this.$(item)
  }

  public getElementValue(element: Cheerio, attribute: string): string {
    if (attribute !== undefined) {
      const value = this.$(element).attr(attribute)
      return (value ? value.trim() : null)
    }

    return this.$(element).text().trim()
  }

  public getElementDataAttributeKeyValue(element: Cheerio, { name, key }: DataAttribute): string | null {
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

  public mapAttribute(item: CheerioElement, options: any): any {
    const { type, selector, attribute, data } = options

    const element = this.getItemOrParentElement(item, selector)
    const value = this.getElementValue(element, attribute)

    if (data !== undefined) {
      return this.getElementDataAttributeKeyValue(element, data)
    }

    const Type = require(`../attributes/${type}.ts`).default
    const typeValue = new Type(value, this.url)
    return typeValue.getValue()
  }

  public getMappedItems(): ScrapedItem[] {
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
