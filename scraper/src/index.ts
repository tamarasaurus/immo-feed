import * as Queue from 'bull'
import * as glob from 'glob'
import { resolve } from 'path'
import { Result } from './sources/result'

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL)
const store = new Queue('store_results', process.env.REDIS_URL)
const sources = glob.sync(resolve(__dirname, './sources/sites/**/*.js'))
let sourceList: any = {}

sources.forEach(source => {
    const sourceModule = new (require(source).default)()
    sourceList[sourceModule.sourceName] = sourceModule
})

console.log('sourceList', sourceList);

scrapeAttributes.process(1, require('./processors/scrape-attributes').bind({ sourceList }))
scrapeAttributes
    .on('error', error => console.error('Error scraping', error))
    .on('active', job => console.log('scrape', job.data.source))
    .on('completed', async function(job: Queue.Job, data: any){
        const { source } = job.data
        const results = data.results
        console.log('finished', source, 'with', results.length, 'results')

        results.forEach((result: Result) => {
            store.add(result)
        })
    })

store.on('active', (job: Queue.Job) => console.log('stored', job.data.link))
store.process(500, require('./processors/store'))

function scrape() {
    console.log('--> start scraping')

    for (let sourceName in sourceList) {
        const sourceModule = sourceList[sourceName]
        scrapeAttributes.add({ source: sourceModule.sourceName })
        console.log('--> scrape', sourceName)
    }
}

function run() {
    scrape()
    console.log('--> start immo-feed')

    setInterval(function () {
        scrape()
    }, parseInt(process.env.SCRAPER_FREQUENCY_MINUTES || '10') * 60 * 1000)
}

run()
