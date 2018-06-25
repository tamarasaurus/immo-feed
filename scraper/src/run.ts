import * as glob from 'glob'
import { join, extname, basename, resolve } from 'path'
import { Result } from './types/result'
import { Storage } from './storage/mongo'
import notify from './notification/slack'

const formatters: any = {}
const formatterList = glob.sync(resolve(__dirname, './formatter/**/*.js'))

formatterList.forEach(formatterPath => {
    const formatter = require(formatterPath)
    const ext = extname(formatterPath)
    const name = basename(formatterPath).replace(ext, '')
    formatters[name] = formatter.default
})

const scrape = async () => {
    const startTime = new Date().getTime()
    const sources: String[] = glob.sync(resolve(__dirname, './source/**/*.js'))

    const results = await Promise.all(
        sources.map(async (sourcePath: string) => {
            const source = require(sourcePath)

            try {
                return new source.default().scrape(formatters)
            } catch (e) {
                console.error(e)
            }
        })
    )

    const flatResults = results.reduce((acc, val) => acc.concat(val), [])

    if (flatResults.length === 0) return;

    const storage = new Storage();
    await Promise.all(flatResults.map((result: Result) => storage.updateOrCreate(result)))

    if (process.env.NOTIFY) {
        const updatedRecords = await storage.findUpdatedSince(startTime);
        await notify(updatedRecords)
    }

    storage.cleanup();
}

async function run() {
    scrape()
    setInterval(function () {
        console.log('Running scraper')
        scrape()
    }, parseInt(process.env.SCRAPE_FREQUENCY || '10') * 60 * 1000);
}

run();
