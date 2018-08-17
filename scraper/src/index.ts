import * as Queue from 'bull'
import * as glob from 'glob'
import { resolve } from 'path'
import { Result } from './types/result'

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL)
const store = new Queue('store_results', process.env.REDIS_URL)
const scrapeDetails = new Queue('scrape_detailed_attributes', process.env.REDIS_URL)
const sources = glob.sync(resolve(__dirname, './source/**/*.js'))
const sourceList: any = {}

sources.forEach(source => {
    const sourceModule = new (require(source).default)()
    sourceList[sourceModule.sourceName] = sourceModule
    scrapeAttributes.add({ source: sourceModule.sourceName })
})

scrapeAttributes.process(100, require('./processors/scrape-attributes').bind({ sourceList }))
scrapeAttributes
    .on('error', error => console.error('Error scraping', error))
    .on('active', job => console.log('Started scraping', job.data.source))
    .on('completed', async function(job: Queue.Job, data: any){
        const { source } = job.data
        const results = data.results
        console.log('Finished scraping', source, 'with', results.length, 'results')

        results.forEach((result: Result) => {
            store.add(result)
            scrapeDetails.add({ source, link: result.link })
        })
    })
    .on('failed', function(job, err){})
    .on('removed', function(job){})

store.on('active', (job: Queue.Job) => console.log('store', job.data.link))
store.process(200, require('./processors/store'))

scrapeDetails.process(2, require('./processors/scrape-details').bind({store, sourceList}))
scrapeDetails.on('failed', (job, err) => {
    console.log('Error scraping details', err)
})
