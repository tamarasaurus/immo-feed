import Leboncoin  from './sites/Leboncoin'
import ScrapedItem from './types/ScrapedItem';

const site = new Leboncoin()
const url = 'https://www.leboncoin.fr/ventes_immobilieres/offres/'

site.scrape(url).then((scrapedItems: ScrapedItem[]) => {
  console.log(scrapedItems)
})

// .then((scrapedItems: any)=> console.log(scrapedItems))