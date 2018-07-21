import * as cheerio from 'cheerio'
import Puppeteer from '../driver/puppeteer'
import { Source } from './source'
import { Result } from './result'
import chalk from 'chalk'

export class HTMLSource extends Source {
    public type = 'html'
    public nextPageSelector: string = null
    public pagesToScrape: number = 1
    public driver: any = new Puppeteer()

    public extractResults(response: string, formatters: any[]): Result[] {
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
                    console.error('\n', chalk.red(e), '\n')
                }
            })

            resultList.push(Object.assign(new Result(), resultAttributes))
        })

        return resultList
    }

    public async scrape(formatters: any[]): Promise<Result[]> {
        console.log(chalk.blue('➡️ scraping', this.scraperName))
        await this.driver.setup(this.url)

        let results = []

        for (let i = 0; i < this.pagesToScrape; i++) {
            const response = await this.driver.scrapePage(i > 0, this.nextPageSelector, this.resultSelector)
            const url = await this.driver.url()
            console.log(chalk.magenta(`   ↘ go to page ${url}`))
            results.push(this.extractResults(response, formatters))
            if (this.nextPageSelector === null) break
        }

        results = results.reduce((acc, val) => acc.concat(val), [])
        console.log(chalk.green(`   ✔️ found ${results.length} results for ${this.scraperName} \n`))

        await this.driver.shutdown()
        return results
    }
}
