import * as request from 'request-promise'
import * as cheerio from 'cheerio'
import { Result } from './result'
import * as puppeteer from 'puppeteer'
import chalk from 'chalk'

class Source {
    public url: string = null
    public resultAttributes: any[] = []
    public resultSelector: string = null
    public scraperName = this.constructor.name.toLocaleLowerCase()
}

export class JSONSource extends Source {
    public type = 'json'

    public async scrape(formatters: any[]): Promise<Result[]> {
        console.log(chalk.blue('➡️ scraping', this.scraperName))
        const response = await request.get(this.url, { resolveWithFullResponse: true })
        const contents = JSON.parse(response.body)
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

    private async getPageContents(): Promise<{ browser: puppeteer.Browser, page: puppeteer.Page}> {
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        })

        const page = await browser.newPage()
        console.log(chalk.blue('➡️ scraping', this.scraperName))
        page.setViewport({ width: 1280, height: 1000 })
        await page.goto(this.url)

        return { browser, page }
    }

    private async extractResults(response: string, formatters: any[]): Promise<Result[]> {
        const $: CheerioStatic = cheerio.load(response)
        const results = $(this.resultSelector)
        const attributes = this.resultAttributes
        const resultList: Result[] = []

        results.toArray().forEach((resultElement: CheerioElement) => {
            const resultAttributes: any = {}

            attributes.forEach((attribute: any) => {
                const { type, selector } = attribute
                const format = attribute.format || formatters[type]
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
        const { browser, page } = await this.getPageContents()
        const results = []

        for (let i = 0; i < this.pagesToScrape; i++) {
            await page.evaluate(_ => { window.scrollBy(0, window.innerHeight) })
            const nextLink = await page.$(this.nextPageSelector)

            if (i > 0 && nextLink) {
                await page.click(this.nextPageSelector)
                await page.waitForSelector(this.resultSelector)
            }

            await page.evaluate(_ => { window.scrollBy(0, window.innerHeight) })
            const response = await page.content()
            console.log(chalk.magenta('   ↘ go to page', page.url()))
            results.push(await this.extractResults(response, formatters))

            if (this.nextPageSelector === null) break
        }

        const flatResults = results.reduce((acc, val) => acc.concat(val), [])
        console.log(chalk.green(`   ✔️ found ${flatResults.length} results for ${this.scraperName} \n`))
        await browser.close()

        return flatResults
    }
}

