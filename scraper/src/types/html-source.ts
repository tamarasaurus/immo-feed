import * as cheerio from 'cheerio'
import Puppeteer from '../driver/puppeteer'
import { Source } from './source'
import { Result } from './result'
import chalk from 'chalk'
import * as glob from 'glob'
import { resolve, extname, basename } from 'path'

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
                    console.error('\n', chalk.red(e), '\n')
                }
            })

            resultList.push(Object.assign(new Result(), resultAttributes))
        })

        return resultList
    }

    public async scrapeDetails(link: Result): Promise<any> {
        await this.driver.setup(link)
        console.log(chalk.green('        - scraping ' + link))
        await this.driver.scrollDown()

        const attributes: any = {}

        for (let attribute of this.richAttributes) {
            try {
                const { type, selector } = attribute

                if (attribute.wait) {
                    await this.driver.waitForSelector(selector, { timeout: 10000 })
                }

                const response = await this.driver.getPageContent()
                const $: CheerioStatic = cheerio.load(response)
                const textFormatter = () => { return $(selector).text().trim() }
                const format = attribute.format || formatters[type] || textFormatter
                attributes[type] = format($, $(selector))
            } catch (e) {
                throw Error(`Error extracting detail ${attribute.selector} from ${await this.driver.url()}`)
            }
        }

        await this.driver.shutdown()
        return attributes
    }

    public async scrape(): Promise<Result[]> {
        console.log('scrape', this, this.url)
        console.log(chalk.blue('➡️ scraping', this.sourceName))
        await this.driver.setup(this.url)

        let results = []

        for (let i = 0; i < this.pagesToScrape; i++) {
            const response = await this.driver.scrapePage(i > 0, this.nextPageSelector, this.resultSelector)
            const url = await this.driver.url()
            console.log(chalk.magenta(`   ↘ go to page ${url}`))
            results.push(this.extractFromResultList(response, formatters))
            if (this.nextPageSelector === null) break
        }

        results = results.reduce((acc, val) => acc.concat(val), [])
        console.log(chalk.green(`   ✔️ found ${results.length} results for ${this.sourceName} \n`))

        await this.driver.shutdown()
        return results
    }
}
