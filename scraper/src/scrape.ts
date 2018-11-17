import * as request from 'request-promise'
import * as randomUserAgent from 'random-useragent';
import * as cheerio from 'cheerio'
import Leboncoin  from './sites/Leboncoin'

const site = new Leboncoin('https://www.leboncoin.fr/ventes_immobilieres/offres/')

request.get({
  url: site.url,
  gzip: true,
  headers: {
    'Accept': 'text/html',
    'Accept-Language': 'fr-FR',
    'User-Agent': randomUserAgent.getRandom()
  }
})
.then((response: string) => site.scrape(response))
.then((scrapedItems: any) => console.log(scrapedItems))