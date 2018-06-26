import { resolve } from 'path'
import * as glob from 'glob'
import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import * as assert from 'assert'

const scrape = async (sourcePath: string) => {
    const sourceModule: any = require(resolve(__dirname, '../', sourcePath))
    const source = sourceModule.default()

    if (source.type === 'json') return;

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.goto(source.url)
    await page.waitForSelector(source.resultSelector)
    const response = await page.content()
    await browser.close()

    const $: CheerioStatic = cheerio.load(response)
    const results = $(source.resultSelector)
    const attributes = source.resultAttributes

    assert(results.length > 0, `${sourcePath} - ${source.resultSelector} is empty`)

    results.toArray().forEach((resultElement: CheerioElement) => {
        attributes.forEach((attribute: any) => {
            const { type, selector } = attribute

            if (selector && type !== 'photo') {
                assert(
                    $(selector, resultElement).length > 0,
                    `${sourcePath} - ${type} element with selector ${selector} is missing`
                )
            }
        })
    })
}

const sources: String[] = glob.sync(resolve(__dirname, '../source/**/*.js'))
sources.map(async (sourcePath: string) => scrape(sourcePath))

export default scrape
