import * as request from 'request-promise'
import * as cheerio from 'cheerio'
import { Result } from './result'

class Source {
    public url: string = null
    public resultAttributes: any[] = []
    public resultSelector: string = null
}

export class JSONSource extends Source {
    public async scrape(formatters: any[]): Promise<Result[]> {
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

        return resultList
    }
}

export class HTMLSource extends Source {
    public async scrape(formatters: any[]): Promise<Result[]> {
        const response = await request.get(this.url, { resolveWithFullResponse: true })
        const $: CheerioStatic = cheerio.load(response.body)
        const results = $(this.resultSelector)
        const attributes = this.resultAttributes
        const resultList: Result[] = []

        results.toArray().forEach((resultElement: CheerioElement) => {
            const resultAttributes: any = {}

            attributes.forEach((attribute: any) => {
                const { type, selector } = attribute
                const format = attribute.format || formatters[type]
                const element = selector ? $(selector, resultElement) : $(resultElement)
                resultAttributes[type] = format($, element)
            })

            resultList.push(Object.assign(new Result(), resultAttributes))
        })

        return resultList
    }
}

