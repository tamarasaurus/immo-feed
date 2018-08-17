import { Storage } from '../storage/mongo'
import { Job, DoneCallback } from 'bull';

module.exports = async function(job: Job, done: DoneCallback) {
    const storage = new Storage()
    const result = job.data
    const storedResult = await storage.updateOrCreate(result)
    storage.cleanup()
    done(null, storedResult)
}
