import { resolve, basename } from 'path'
import * as glob from 'glob'
import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import * as assert from 'assert'

const scrape = async (sourcePath: string) => {
    const sourceName = basename(sourcePath, '.js')
    const sourceModule: any = require(resolve(__dirname, '../', sourcePath))
    const source = sourceModule.default()

    if (source.type === 'json') return;

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        await page.goto(source.url)
        await page.waitForSelector(source.resultSelector)
        const response = await page.content()
        await browser.close()

        const $: CheerioStatic = cheerio.load(response)
        const results = $(source.resultSelector)
        const attributes = source.resultAttributes

        assert(results.length > 0, `${sourceName} - ${source.resultSelector} is empty`)

        const selectors: any = {}

        results.toArray().forEach((resultElement: CheerioElement) => {

            attributes.forEach((attribute: any) => {
                const type = attribute.type
                let selector = attribute.selector || source.resultSelector

                if (!selectors[selector]) selectors[selector] = []

                selectors[selector].push({
                    selector,
                    type,
                    isEmpty: $(selector, resultElement).length === 0 && $(selector).length === 0
                })
            })
        })

        for (let i in selectors) {
            const selector = selectors[i]

            if (selector.every((val: any) => val.isEmpty === true)) {
                console.log(`✖ ${sourceName} - ${i}`);
                process.exit(1)
            } else {
                console.log(`✔ ${sourceName} - ${i}`);
            }

        }

        console.log('\n')
    } catch (e) {
        console.log('Can\'t load', sourcePath, e)
        process.exit(1)
    }

}

const sources: String[] = glob.sync(resolve(__dirname, '../source/**/*.js'))

console.log('➡️ testing', sources, '\n')

async function test() {
    await Promise.all(sources.map(async (sourcePath: string) => scrape(sourcePath)))
}

test()
