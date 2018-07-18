import { resolve, basename } from 'path'
import * as glob from 'glob'
import * as cheerio from 'cheerio'
import * as assert from 'assert'
import chalk from 'chalk'
import { HTMLSource, JSONSource } from '../types/source'

const testHTMLSource = async (source: HTMLSource, sourcePath: string) => {
    const sourceName = basename(sourcePath, '.js')
    const { browser, page } = await source.getContents()
    const response = await source.scrapePage(page, 0)
    const $: CheerioStatic = cheerio.load(response)
    await browser.close()

    const results = $(source.resultSelector)
    const attributes = source.resultAttributes

    assert(results.length > 0, `${sourceName} - ${source.resultSelector} is empty`)
    console.log(chalk.green(`✔ ${sourceName} - ${source.resultSelector}`))

    if (source.nextPageSelector) {
        const nextPageSelector = $(source.nextPageSelector)
        assert(nextPageSelector.length > 0, `${sourceName} - ${source.nextPageSelector} is empty`)
        console.log(chalk.green(`✔ ${sourceName} - ${source.nextPageSelector}`))
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

        console.log(chalk.green(`✔ ${sourceName} - ${i}`))
    }
}

const testJSONSource = async (source: JSONSource, sourcePath: string) => {
    const sourceName = source.scraperName
    const contents = await source.getContents()

    assert(
        contents.hasOwnProperty(source.resultSelector),
        `✖ ${sourceName} - ${source.resultSelector}`
    )

    console.log(chalk.green(`✔ ${sourceName} - ${source.resultSelector}`))

    source.resultAttributes.forEach(attribute => {
        const firstItem = contents[source.resultSelector][0]

        assert(
            firstItem.hasOwnProperty(attribute.selector),
            `✖ ${sourceName} - ${attribute.selector}`
        )

        console.log(chalk.green(`✔ ${sourceName} - ${attribute.selector}`))
    })
}

const scrape = async (sourcePath: string) => {
    const sourceModule: any = require(resolve(__dirname, '../', sourcePath))
    const source = new sourceModule.default()

    try {
        if (source.type === 'html') {
            return await testHTMLSource(source, sourcePath)
        }

        return await testJSONSource(source, sourcePath)
    } catch (e) {
        console.log(chalk.red('\n Tests failed with error: \n\n', sourcePath, '\n', e, '\n'))
        process.exit(1)
    }
}

async function testSources() {
    const sources: string[] = glob.sync(resolve(__dirname, '../source/**/*.js'))
    console.log('\n ➡️ testing sources \n', sources, '\n')
    await Promise.all(sources.map(async (sourcePath: string) => scrape(sourcePath)))
}

testSources()
