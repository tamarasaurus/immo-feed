import * as Queue from 'bull'
import * as glob from 'glob'
import { resolve } from 'path'
import { Result } from './types/result'
import { Storage } from './storage/mongo'

const scrapeAttributes = new Queue('scrape attributes')
const store = new Queue('store results')
const scrapeDetails = new Queue('scrape detailed attributes')

const blah = (async () => {
   await Promise.all([ scrapeAttributes.empty(), store.empty(), scrapeDetails.empty() ]).then(() => {
        console.log('emptied everything')
    })
})().catch((err: Error) => {
    console.error(err);
});

const sources = glob.sync(resolve(__dirname, './source/**/*.js'))
const sourceList: any = {}

sources.forEach(source => {
    const sourceModule = new (require(source).default)()
    sourceList[sourceModule.sourceName] = sourceModule
})

scrapeAttributes.add({ source: 'leboncoin' })

scrapeAttributes.process((job: Queue.Job, done: Queue.DoneCallback) => {
    try {
        const { source } = job.data
        const sourceModule = sourceList[source]

        sourceModule.scrape()
            .then((results: Result[]) => done(null, { results }))
            .catch((e: Error) => done(e))

    } catch(e) {
        console.log('Error', e)
    }

})

scrapeAttributes.on('error', function(error) {
    console.error('Error scraping', error)
})
.on('active', function(job){
    console.log('Started scraping', job.data.source)
})
.on('completed', async function(job: Queue.Job, data: any){
    const { source } = job.data
    const results = data.results
    console.log('Finished scraping', source, 'with', results.length, 'results')

    results.forEach((result: Result) => {
        store.add(result)
        scrapeDetails.add({ source, link: result.link })
    })
})
.on('failed', function(job, err){
  // A job failed with reason `err`!
})
.on('removed', function(job){
  // A job successfully removed.
})

store.on('active', (job: Queue.Job) => {
    console.log('store', job.data.link)
})

store.process(200, async function(job: Queue.Job, done: Queue.DoneCallback) {
    const storage = new Storage()
    const result = job.data
    const storedResult = await storage.updateOrCreate(result)
    storage.cleanup()
    done(null, storedResult)
})

scrapeDetails.process(20, async function(job: Queue.Job, done: Queue.DoneCallback) {
    const { source, link } = job.data
    const sourceModule = sourceList[source]
    const details = await sourceModule.scrapeDetails(link)
    store.add({ link, details })
    done(null, details)
})
