import { Job, DoneCallback } from "bull";

module.exports = async function(job: Job, done: DoneCallback) {
    try {
        const { source, link } = job.data
        const sourceModule = this.sourceList[source]
        const details = await sourceModule.scrapeDetails(link)
        this.store.add({ link, details })
        done(null, details)
    } catch (e) {
        done(e)
    }
}
