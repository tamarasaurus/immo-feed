import { Result } from "../types/result";
import { Job, DoneCallback } from "bull";

module.exports = function(job: Job, done: DoneCallback) {
    try {
        const { source } = job.data
        const sourceModule = this.sourceList[source]

        sourceModule.scrape()
            .then((results: Result[]) => done(null, { results }))
            .catch((e: Error) => done(e))
    } catch (e) {
        done(e)
    }
}
