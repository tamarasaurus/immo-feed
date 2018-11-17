import * as request from 'request-promise'
import * as randomUserAgent from 'random-useragent';
import Leboncoin  from './sites/Leboncoin'

const site = new Leboncoin()

request.get({
  url: 'https://www.leboncoin.fr/ventes_immobilieres/offres/',
  gzip: true,
  headers: {
    'Accept': 'text/html',
    'Accept-Language': 'fr-FR',
    'User-Agent': randomUserAgent.getRandom()
  }
})
.then((response: string) => site.scrape(response))
.then((scrapedItems: any) => console.log(scrapedItems))