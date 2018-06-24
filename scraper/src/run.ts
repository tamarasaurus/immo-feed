import * as glob from 'glob'
import { join, extname, basename } from 'path'
import { Result } from './types/result'
import { Storage } from './storage/mongo'
import notify from './notification/slack'

const storage = new Storage()
const formatters: any = {}
const formatterList = glob.sync('build/formatter/**/*.js')

formatterList.forEach(formatterPath => {
    const formatter = require(join(process.cwd(), formatterPath))
    const ext = extname(formatterPath)
    const name = basename(formatterPath).replace(ext, '')
    formatters[name] = formatter.default
})

const scrape = async () => {
    const startTime = new Date().getTime()
    const sources: String[] = glob.sync('build/source/**/*.js')

    const results = await Promise.all(
            sources.map(async (sourcePath: string) => {
            const source = require(join(process.cwd(), sourcePath))

            try {
                return new source.default().scrape(formatters)
            } catch (e) {
                console.error(e)
            }
        })
    )

    const flatResults = results.reduce((acc, val) => acc.concat(val), [])
    await Promise.all(flatResults.map((result: Result) => storage.updateOrCreate(result) ))

    // notify(await storage.findUpdatedSince(startTime))
    storage.cleanup()
}

scrape()
