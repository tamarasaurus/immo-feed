import * as request from 'request-promise'
import * as cheerio from 'cheerio'
import { Result } from './result'
import * as puppeteer from 'puppeteer'

class Source {
    public url: string = null
    public resultAttributes: any[] = []
    public resultSelector: string = null
}

export class JSONSource extends Source {
    public type = 'json'

    public async scrape(formatters: any[]): Promise<Result[]> {
        console.log('➡️ scraping', this.url)
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

        console.log('✔️ found', resultList.length, 'results for', this.url)

        return resultList
    }
}

export class HTMLSource extends Source {
    public type = 'html'

    public async scrape(formatters: any[]): Promise<Result[]> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        const page = await browser.newPage()
        console.log('➡️ scraping', this.url)
        await page.goto(this.url)
        const response = await page.content()
        await browser.close()

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
                    console.log(e)
                }
            })

            resultList.push(Object.assign(new Result(), resultAttributes))
        })

        console.log('✔️ found', resultList.length, 'results for', this.url)
        return resultList
    }
}

