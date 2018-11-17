import * as Queue from 'bull'
import ScrapedItem from './types/ScrapedItem';

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL)
const store = new Queue('store_results', process.env.REDIS_URL)

// @TODO should be an array
const urls = {
  Leboncoin: 'https://www.leboncoin.fr/ventes_immobilieres/offres/',
  Francois: 'https://www.francois-et-francois-immobilier.com/achat/',
  Ouestfrance: 'https://www.ouestfrance-immo.com/acheter/nantes-44-44000/?types=maison,appartement',
  Seloger: 'https://www.seloger.com/list.htm?types=1,2&projects=2,5&natures=1,2,4&qsVersion=1.0'
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
