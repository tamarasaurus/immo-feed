import { resolve, basename } from 'path'
import * as glob from 'glob'
import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import * as assert from 'assert'
import * as request from 'request-promise'
import { HTMLSource, JSONSource } from '../types/source';

const testHTMLSource = async (source: HTMLSource, sourcePath: string) => {
    const sourceName = basename(sourcePath, '.js')
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        pipe: true,
        timeout: 60000
    })

    const page = await browser.newPage()
    await page.goto(source.url)
    await page.waitForSelector(source.resultSelector, { timeout: 60000 })
    const response = await page.content()
    await browser.close()

    const $: CheerioStatic = cheerio.load(response)
    const results = $(source.resultSelector)
    const attributes = source.resultAttributes

    assert(results.length > 0, `${sourceName} - ${source.resultSelector} is empty`)
    console.log(`✔ ${sourceName} - ${source.resultSelector}`)

    if (source.nextPageSelector) {
        const nextPageSelector = $(source.nextPageSelector)
        assert(nextPageSelector.length > 0, `${sourceName} - ${source.nextPageSelector} is empty`)
        console.log(`✔ ${sourceName} - ${source.nextPageSelector}`)
    }

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

        assert(
            !(selector.every((val: any) => val.isEmpty === true)),
            `✖ ${sourceName} - ${i}`
        )

        console.log(`✔ ${sourceName} - ${i}`);
    }

    console.log('\n')
}

const testJSONSource = async (source: JSONSource, sourcePath: string) => {
    const sourceName = basename(sourcePath, '.js')
    const response = await request.get(source.url, { resolveWithFullResponse: true })
    const contents = JSON.parse(response.body)

    assert(
        contents.hasOwnProperty(source.resultSelector),
        `✖ ${sourceName} - ${source.resultSelector}`
    )

    console.log(`✔ ${sourceName} - ${source.resultSelector}`);

    source.resultAttributes.forEach(attribute => {
        const firstItem = contents[source.resultSelector][0]

        assert(
            firstItem.hasOwnProperty(attribute.selector),
            `✖ ${sourceName} - ${attribute.selector}`
        )

        console.log(`✔ ${sourceName} - ${attribute.selector}`);
    })

    console.log('\n')
}

const scrape = async (sourcePath: string) => {
    const sourceModule: any = require(resolve(__dirname, '../', sourcePath))
    const source = sourceModule.default()

    try {
        if (source.type === 'html') {
            return await testHTMLSource(source, sourcePath)
        }

        return await testJSONSource(source, sourcePath)
    } catch (e) {
        console.log('\n Tests failed with error: \n\n', sourcePath, '\n', e, '\n')
        process.exit(1)
    }
}

const sources: String[] = glob.sync(resolve(__dirname, '../source/**/*.js'))

console.log('➡️ testing \n', sources, '\n')

async function test() {
    await Promise.all(sources.map(async (sourcePath: string) => scrape(sourcePath)))
}

test()
