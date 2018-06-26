import { resolve } from 'path'
import * as glob from 'glob'
import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import * as assert from 'assert'

const scrape = async (sourcePath: string) => {
    const sourceModule: any = require(resolve(__dirname, '../', sourcePath))
    const source = sourceModule.default()

    console.log(source.type)

    if (source.type === 'json') return;

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.goto(source.url)
    const response = await page.content()
    await browser.close()

    const $: CheerioStatic = cheerio.load(response)
    const results = $(source.resultSelector)
    const attributes = source.resultAttributes

    assert(results.length > 0, `${source.resultSelector} is empty`)

    results.toArray().forEach((resultElement: CheerioElement) => {
        attributes.forEach((attribute: any) => {
            const { type, selector } = attribute
            assert.equal(
                $(selector, resultElement).length, 1,
                `${type} element with selector ${selector} is missing`
            )
        })
    })
}

const sources: String[] = glob.sync(resolve(__dirname, '../source/**/*.js'))
console.log(sources)

sources.map(async (sourcePath: string) => scrape(sourcePath))

// scrape('./source/leboncoin.js')

export default scrape
