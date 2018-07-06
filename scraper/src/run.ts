import * as glob from 'glob'
import { extname, basename, resolve } from 'path'
import { Result } from './types/result'
import { Storage } from './storage/mongo'
import notify from './notification/email'
import chalk from 'chalk'

const formatters: any = {}
const formatterList = glob.sync(resolve(__dirname, './formatter/**/*.js'))

formatterList.forEach(formatterPath => {
    const formatter = require(formatterPath)
    const ext = extname(formatterPath)
    const name = basename(formatterPath).replace(ext, '')
    formatters[name] = formatter.default
})

const scrape = async () => {
    const startTime = new Date()
    console.log(chalk.yellow(`  🗘  started at (${startTime.toLocaleString('en-GB')}) \n`))
    const sources: string[] = glob.sync(resolve(__dirname, './source/**/*.js'))
    const results = []

    for (let sourcePath of sources) {
        const source = require(sourcePath)

        try {
            results.push(await new source.default().scrape(formatters))
        } catch (e) {
            console.error('\n', chalk.red(e), '\n')
        }
    }

    const flatResults = results.reduce((acc, val) => acc.concat(val), [])
    if (flatResults.length === 0) return

    const storage = new Storage()

    const updatedOrCreatedResults = await Promise.all(flatResults.map(async (result: Result) => {
        try {
            return await storage.updateOrCreate(result)
        } catch (e) {
            console.log(chalk.red(`\n Error storing result: ${JSON.stringify(result, null, 2)} ${e}`))
            return null
        }
    }))

    const newlyCreatedResults = updatedOrCreatedResults.filter((result: Result) => {
        return result && new Date(result.date).getTime() > startTime.getTime()
    }).sort((a: Result, b: Result) => {
        return new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1
    })

    console.log('\n', chalk.yellow(` ⇣  stored ${newlyCreatedResults.length} new results`))
    console.log(chalk.yellow(`\n  ●  finished at (${new Date().toLocaleString('en-GB')}) \n`))

    if (process.env.NOTIFY && newlyCreatedResults.length > 0) {
        await notify(newlyCreatedResults)
    }

    storage.cleanup()
}

async function run() {
    console.log(chalk.green('  🏠  starting immo-feed scraper \n'))
    scrape()
    setInterval(function () {
        console.log(chalk.green(new Date().toLocaleString(), 'running'))
        scrape()
    }, parseInt(process.env.SCRAPER_FREQUENCY_MINUTES || '10') * 60 * 1000)
}

run()
