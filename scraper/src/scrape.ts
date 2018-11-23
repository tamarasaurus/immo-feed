import * as Queue from 'bull'
import ScrapedItem from './types/ScrapedItem'

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL)
const store = new Queue('store_results', process.env.REDIS_URL)
const sites = require('./sites.json').sites

scrapeAttributes.process('scrape', 1, require('./jobs/scrape.ts'))
scrapeAttributes
    .on('error', error => console.error('Error scraping', error))
    .on('active', job => console.log('scrape', job.data))
    .on('completed', function(job: Queue.Job, items: ScrapedItem[]) {
      console.log('Finished scraping', job.data.name, 'with', items.length, 'items')

      for (const item of items) {
        store.add('store', item)
      }
    })

store.on('active', (job: Queue.Job) => console.log('Stored', job.data.link))
store.process('store', 500, require('./jobs/store'))

function scrape() {
  sites.forEach((site: any) => {
    const [ name, url ] = site
    console.log('Start scraping', name, url)
    scrapeAttributes.add('scrape', { name, url })
  })
}

function run() {
  scrape()

  setInterval(function() {
      scrape()
  }, parseInt(process.env.SCRAPER_FREQUENCY_MINUTES || '10', 10) * 60 * 1000)
}

run()
