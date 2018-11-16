import * as Queue from 'bull'
import * as glob from 'glob'
import { resolve } from 'path'

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL)
const store = new Queue('store_results', process.env.REDIS_URL)
const sources = glob.sync(resolve(__dirname, './sources/sites/**/*.ts'))
let sourceList: any = {}

sources.forEach((source: string) => {
    const sourceModule = new (require(source).default)()
    sourceList[sourceModule.sourceName] = sourceModule
})

scrapeAttributes.process('scrape', 1, require('./processors/scrape-attributes').bind({ sourceList }))
scrapeAttributes
    .on('error', error => console.error('Error scraping', error))
    .on('active', job => console.log('scrape', job.data.source))
    .on('completed', async function(job: Queue.Job, data: any){
        const { source } = job.data
        const results = data.results
        console.log('finished', source, 'with', results.length, 'results')
        store.add('store', results)
    })

store.on('active', (job: Queue.Job) => console.log('stored', job.data.length))
store.process('store', 500, require('./processors/store'))

function scrape() {
    console.log('--> start scraping')

    for (let sourceName in sourceList) {
        const sourceModule = sourceList[sourceName]
        scrapeAttributes.add('scrape', { source: sourceModule.sourceName })
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
