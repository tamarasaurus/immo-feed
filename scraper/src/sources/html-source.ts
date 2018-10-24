import { resolve, extname, basename } from 'path'
import * as cheerio from 'cheerio'
import * as glob from 'glob'

import Puppeteer from '../driver/puppeteer'
import { Source } from './source'
import { Result } from './result'

const formatters: any = {}
const formatterList = glob.sync(resolve(__dirname, '../formatter/**/*.js'))

formatterList.forEach(formatterPath => {
    const formatter = require(formatterPath)
    const ext = extname(formatterPath)
    const name = basename(formatterPath).replace(ext, '')
    formatters[name] = formatter.default
})

export class HTMLSource extends Source {
    public type = 'html'
    public nextPageSelector: string = null
    public pagesToScrape: number = 1
    public driver: any = new Puppeteer()

    public extractFromResultList(response: string, formatters: any[]): Result[] {
        const $: CheerioStatic = cheerio.load(response)
        const results = $(this.resultSelector)
        const attributes = this.resultAttributes
        const resultList: Result[] = []

        results.toArray().forEach((resultElement: CheerioElement) => {
            const resultAttributes: any = {}

            attributes.forEach((attribute: any) => {
                const { type, selector } = attribute
                const textFormatter = () => { return $(selector, resultElement).text().trim() }
                const format = attribute.format || formatters[type] || textFormatter
                const element = selector ? $(selector, resultElement) : $(resultElement)

                try {
                    resultAttributes[type] = format($, element)
                } catch (e) {
                    console.error(e)
                }
            })

            resultList.push(Object.assign(new Result(), resultAttributes))
        })

        return resultList
    }

    public async scrape(): Promise<Result[]> {
        console.log('-- scrape')

        try {
            await this.driver.setup(this.url)
        } catch (e) {
            console.error('Cannot set up page', e)
        }

        let results = []

        for (let i = 0; i < this.pagesToScrape; i++) {
            const response = await this.driver.scrapePage(i > 0, this.nextPageSelector, this.resultSelector)
            results.push(this.extractFromResultList(response, formatters))
            if (this.nextPageSelector === null) break
        }

        results = results.reduce((acc, val) => acc.concat(val), [])

        await this.driver.shutdown()
        return results
    }
}
