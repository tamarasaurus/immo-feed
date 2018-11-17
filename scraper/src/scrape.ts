import * as Queue from 'bull'
import ScrapedItem from './types/ScrapedItem';

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL)
const store = new Queue('store_results', process.env.REDIS_URL)

const sites = [
  ['Leboncoin','https://www.leboncoin.fr/ventes_immobilieres/offres/'],
  ['Francois','https://www.francois-et-francois-immobilier.com/achat/'],
  ['Ouestfrance', 'https://www.ouestfrance-immo.com/acheter/nantes-44-44000/?types=maison,appartement' ],
  ['Seloger', 'https://www.seloger.com/list.htm?types=1,2&projects=2,5&natures=1,2,4&qsVersion=1.0'],
  ['Stephane', 'http://www.stephaneplazaimmobilier-nantesest.com/catalog/result_carto.php?action=update_search&map_polygone=&C_28=Vente&C_28_search=EGAL&C_28_type=UNIQUE&site-agence=&C_65_search=CONTIENT&C_65_type=TEXT&C_65=44+NANTES&C_65_temp=44+NANTES&cfamille_id=&C_33_search=COMPRIS&C_33_type=TEXT&C_33_MIN=&C_33_MAX=&C_30_search=INFERIEUR&C_30_type=NUMBER&C_30=&C_30_format_quick=']
]

scrapeAttributes.process('scrape', 1, require('./jobs/scrape.ts'))
scrapeAttributes
    .on('error', error => console.error('Error scraping', error))
    .on('active', job => console.log('scrape', job.data))
    .on('completed', function(job: Queue.Job, items: ScrapedItem[]){
      console.log('Finished scraping', job.data.name, 'with', items.length, 'items')
      store.add('store', items)
    })

store.on('active', (job: Queue.Job) => console.log('Stored', job.data.length, 'items'))
store.process('store', 500, require('./jobs/store'))

sites.forEach((site) => {
  const [ name, url ] = site
  console.log('Start scraping', name, url)
  scrapeAttributes.add('scrape', { name, url })
})
