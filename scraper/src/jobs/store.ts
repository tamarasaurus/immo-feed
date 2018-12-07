import { Job, DoneCallback } from 'bull'
import * as request from 'request-promise'

module.exports = function(job: Job, done: DoneCallback) {
    const result = job.data

    request({
        method: 'post',
        url: `${process.env.API_URL}/results`,
        body: result,
        json: true,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
    .then((savedResult) => done(null, savedResult))
    .catch((error: Error) => done(error))
}
