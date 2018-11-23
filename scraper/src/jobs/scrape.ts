import { Job, DoneCallback } from 'bull'
import ScrapedItem from '../types/ScrapedItem'
import * as request from 'request-promise'
import * as randomUserAgent from 'random-useragent'
import HTMLSite from '../types/HTMLSite'

module.exports = function(job: Job, done: DoneCallback) {
    try {
      const { name, url } = job.data
      const site: any = require(`../sites/${name}.json`)
      const userAgent = randomUserAgent.getRandom()

      request.get({
          url,
          gzip: true,
          proxy: null,
          headers: {
            'Accept': 'text/html',
            'Accept-Language': 'fr-FR',
            'User-Agent': userAgent,
          },
      })
      .then((contents) => {
        const page = new HTMLSite(site, url, contents)
        return page.getMappedItems()
      })
      .then((results: ScrapedItem[]) => done(null, results))
      .catch((e: Error) => done(e))

    } catch (e) {
      done(e)
    }
}
