import * as request from 'request-promise'
import * as cheerio from 'cheerio'
import { Result } from './result'
import * as puppeteer from 'puppeteer'
import chalk from 'chalk'
import Puppeteer from '../driver/puppeteer'

class Source {
    public url: string = null
    public resultAttributes: any[] = []
    public resultSelector: string = null
    public scraperName = this.constructor.name.toLocaleLowerCase()
}

export class JSONSource extends Source {
    public type = 'json'

    public async getContents(): Promise<any> {
        console.log(chalk.blue('➡️ scraping', this.scraperName))
        const response = await request.get(this.url, { resolveWithFullResponse: true })
        return JSON.parse(response.body)
    }

    public async scrape(): Promise<Result[]> {
        const contents = await this.getContents()
        const results = contents[this.resultSelector]
        const attributes = this.resultAttributes
        const resultList: Result[] = []

        results.forEach((resultElement: any) => {
            const resultAttributes: any = {}

            attributes.forEach((attribute: any) => {
                const { type, selector, format } = attribute
                const element = resultElement[selector]
                resultAttributes[type] = format ? format(element) : element
            })

            resultList.push(Object.assign(new Result(), resultAttributes))
        })

        console.log(chalk.green(`   ✔️ found ${resultList.length} results for ${this.scraperName} \n`))

        return resultList
    }
}

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

