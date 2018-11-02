import { Source } from './source'
import { Result } from './result'
import Request from '../driver/request'

export class JSONSource extends Source {
    public type = 'json'
    public driver: any = new Request()

    public async getContents(): Promise<any> {
        const response = await this.driver.get(this.url, { resolveWithFullResponse: true })
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

        return resultList
    }
}
