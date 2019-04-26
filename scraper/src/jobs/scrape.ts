import { Job, DoneCallback } from 'bull'
import stephaneLink from '../attributes/StephaneLink'
import Scraper from 'contract-scraper';


function scrape(job: Job, done: DoneCallback) {
  try {
    const { url, contract } = job.data
    return new Scraper(url, contract, { 'stephane-link': stephaneLink }).scrapePage()
      .then((results: any[]) => done(null, results))
      .catch((e: Error) => done(e))
  } catch (e) {
    done(e)
  }
}

export default scrape
