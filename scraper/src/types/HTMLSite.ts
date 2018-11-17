import * as cheerio from 'cheerio'
import AttributeType from './AttributeType'
import ScrapedItem from './ScrapedItem'
import * as request from 'request-promise'
import * as randomUserAgent from 'random-useragent';
import * as puppeteer from 'puppeteer'

export default class HTMLSite {
  public attributes: {[name: string]: AttributeType}
  public itemSelector: string

  getPageContents(url: string): request.RequestPromise {
    const userAgent = randomUserAgent.getRandom()

    return request.get({
        url,
        gzip: true,
        headers: {
          'Accept': 'text/html',
          'Accept-Language': 'fr-FR',
          'User-Agent': userAgent
        }
    })
  }

  async scrape(url: string): Promise<ScrapedItem[]> {
    const response = await this.getPageContents(url)
    const $: CheerioStatic = cheerio.load(response)
    const scrapedItems: ScrapedItem[] = []
    const items = $(this.itemSelector).toArray()

    items.forEach(item => {
      const scrapedAttributes: any = {}

      Object.entries(this.attributes).forEach(([ name, options ]) => {
        const Type: any = options.type
        const element = $(options.selector, item)
        let value = element.text().trim()

        if (options.attribute) {
          value = element.attr(options.attribute).trim()
        }

        scrapedAttributes[name] = new Type(value, url).getValue()
      })

      scrapedItems.push(Object.assign(new ScrapedItem(), scrapedAttributes))
    })

    return scrapedItems
  }
}