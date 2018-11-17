import * as Queue from 'bull'
import ScrapedItem from './types/ScrapedItem';

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL)
const store = new Queue('store_results', process.env.REDIS_URL)

const urls = {
  Leboncoin: 'https://www.leboncoin.fr/ventes_immobilieres/offres/'
}

scrapeAttributes.process('scrape', 1, require('./jobs/scrape.ts'))
scrapeAttributes
    .on('error', error => console.error('Error scraping', error))
    .on('active', job => console.log('scrape', job.data))
    .on('completed', function(job: Queue.Job, items: ScrapedItem[]){
      console.log('Finished scraping', job.data.name, 'with', items.length, 'items')
      store.add('store', items)
    })

store.on('active', (job: Queue.Job) => console.log('stored', job.data.length))
store.process('store', 500, require('./jobs/store'))

Object.entries(urls).forEach(([name, url]) => {
  console.log('Start scraping', name, url)
  scrapeAttributes.add('scrape', { name, url })
})
