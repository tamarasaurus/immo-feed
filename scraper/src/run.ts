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

const getResultsFromSources = async (): Promise<Result[]> => {
    let sources: string[] = glob.sync(resolve(__dirname, './source/**/*.js'))

    if (process.env.SOURCE) {
        sources = sources.filter(source => source.indexOf(process.env.SOURCE) > -1)
    }

    const results = []

    for (let sourcePath of sources) {
        const source = require(sourcePath)

        try {
            results.push(await new source.default().scrape(formatters))
        } catch (e) {
            console.error('\n', chalk.red(e), '\n')
        }
    }

    return results.reduce((acc, val) => acc.concat(val), [])
}

const storeResults = async (results: Result[], startTime: Date) => {
    const storage = new Storage()

    const updatedOrCreatedResults = await Promise.all(results.map(async (result: Result) => {
        try {
            return await storage.updateOrCreate(result)
        } catch (e) {
            console.log(chalk.red(`\n Error storing result: ${JSON.stringify(result, null, 2)} ${e}`))
            return null
        }
    }))

    const createdResults = updatedOrCreatedResults.filter((result: Result) => {
        return result && new Date(result.date).getTime() > startTime.getTime()
    }).sort((a: Result, b: Result) => {
        return new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1
    })

    storage.cleanup()

    return createdResults
}

const scrape = async () => {
    const startTime = new Date()
    console.log(chalk.yellow(`  🗘  started at (${startTime.toLocaleString('en-GB')}) \n`))
    const results = await getResultsFromSources()

     if (results.length === 0) return
    const createdResults = await storeResults(results, startTime)

    console.log('\n', chalk.yellow(` ⇣  stored ${createdResults.length} new results`))
    console.log(chalk.yellow(`\n  ●  finished at (${new Date().toLocaleString('en-GB')}) \n`))

    console.log('NOTIFY', parseInt(process.env.NOTIFY) === 1)

    if (parseInt(process.env.NOTIFY) === 1 && createdResults.length > 0) {
        await notify(createdResults)
    }
}

export async function run() {
    console.log(chalk.green('  🏠 starting immo-feed scraper \n'))
    scrape()
    setInterval(function () {
        console.log(chalk.green(new Date().toLocaleString(), 'running'))
        scrape()
    }, parseInt(process.env.SCRAPER_FREQUENCY_MINUTES || '10') * 60 * 1000)
}

run()
