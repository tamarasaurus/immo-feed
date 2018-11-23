import { Job, DoneCallback } from 'bull'
import * as request from 'request-promise'

console.log(process.env.API_URL)

module.exports = async function(job: Job, done: DoneCallback) {
    try {
        const results = job.data
        const storedResults = []

        for (const result of results) {
            storedResults.push(
                await request({
                    method: 'post',
                    url: `${process.env.API_URL}/results`,
                    body: result,
                    json: true
                })
            )
        }

        done(null, storedResults)
    } catch (e) {
        done(e)
    }
}
