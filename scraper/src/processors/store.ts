import { Storage } from '../storage/mongo'
import { Job, DoneCallback } from 'bull';

module.exports = async function(job: Job, done: DoneCallback) {
    try {
        const storage = new Storage()
        const results = job.data
        const storedResults = await storage.updateOrCreate(results)
        storage.cleanup()
        done(null, storedResults)
    } catch (e) {
        done(e)
    }
}
