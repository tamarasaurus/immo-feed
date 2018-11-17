import * as cheerio from 'cheerio'
import Attribute from './Attribute'
import Item from './Item'

export default class HTMLSite {
  public attributes: {[name: string]: Attribute}
  public itemSelector: string

  scrape(response: string): Item[] {
    const $: CheerioStatic = cheerio.load(response)
    const scrapedItems: Item[] = []
    const items = $(this.itemSelector).toArray()

    // fs.writeFileSync('./debug/leboncoin.html', $('body').html(), { encoding: 'utf-8'})

    items.forEach(item => {
      const scrapedAttributes: any = {}

      Object.entries(this.attributes).forEach(([ name, options ]) => {
        const Type: any = options.type
        const element = $(options.selector, item)
        scrapedAttributes[name] = new Type(element.text().trim())
      })

      scrapedItems.push(Object.assign(new Item(), scrapedAttributes))
    })

    return scrapedItems
  }
}