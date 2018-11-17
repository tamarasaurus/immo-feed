import { Job, DoneCallback } from "bull";
import ScrapedItem from "../types/ScrapedItem";

module.exports = function(job: Job, done: DoneCallback) {
    try {
      const { name, url } = job.data
      const siteModule: any = require(`../sites/${name}.ts`)
      const site = new siteModule.default()

      site.scrape(url)
        .then((results: ScrapedItem[]) => done(null, results))
        .catch((e: Error) => done(e))
    } catch (e) {
      done(e)
    }
}
