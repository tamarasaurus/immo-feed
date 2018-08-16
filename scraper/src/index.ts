import * as Queue from 'bull'
import * as glob from 'glob'
import { resolve } from 'path'
import { Result } from './types/result'
import { Storage } from './storage/mongo'

const sources = glob.sync(resolve(__dirname, './source/**/*.js'))
const scrapeAttributes = new Queue('scrape attributes')
const storeResults = new Queue('store results')
const scrapeRichAttributes = new Queue('scrape rich attributes')
const notify = new Queue('notify')


storeResults.process(async function(job, done) {
    const storage = new Storage()
    const results = job.data

    const storedResults = await Promise.all(results.map(async (result: Result) => {
        return await storage.updateOrCreate(result)
    }))

    storage.cleanup()

    done(null, storedResults)
})

// Scrape attributes and get a result
scrapeAttributes.process(function(job, done){
    try {
        console.log(job.data)
        const { path } = job.data
        const sourceModule = require(path).default

        new sourceModule().scrape()
            .then((results: Result[]) => done(null, results))
            .catch((e: Error) => done(e))

    } catch(e) {
        console.log('Error', e)
    }

})

scrapeAttributes.add({ path: sources[1] })

scrapeAttributes.on('error', function(error) {
    console.error('Error scraping', error)
})
.on('active', function(job, jobPromise){
    console.log('Started scraping', job.data.path)
})
.on('stalled', function(job){
  // A job has been marked as stalled. This is useful for debugging job
  // workers that crash or pause the event loop.
})
.on('completed', function(job, results: Result[]){
    console.log('Finished scraping', job.data.path, 'with', results.length, 'results')
    storeResults.add(results)
})

.on('failed', function(job, err){
  // A job failed with reason `err`!
})

.on('paused', function(){
  // The queue has been paused.
})

.on('removed', function(job){
  // A job successfully removed.
})


// separate rich attributes from regular ones
