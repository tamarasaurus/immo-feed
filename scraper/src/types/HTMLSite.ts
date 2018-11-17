import * as cheerio from 'cheerio'
import Attribute from './Attribute'

export default class HTMLSite {
  public itemSelector: string
  public attributes: {[name: string]: Attribute}

  scrape(response: string) {
    const $: CheerioStatic = cheerio.load(response)
    const scrapedItems: any = []
    const items = $(this.itemSelector).toArray()

    // fs.writeFileSync('./debug/leboncoin.html', $('body').html(), { encoding: 'utf-8'})

    items.forEach(item => {
      const scrapedAttributes: any = {}

      Object.entries(this.attributes).forEach(([ name, options ]) => {
        const Type: any = options.type
        const element = $(options.selector, item)
        scrapedAttributes[name] = new Type(element.text().trim())
      })

      scrapedItems.push(scrapedAttributes)
    })

    return scrapedItems
  }
}