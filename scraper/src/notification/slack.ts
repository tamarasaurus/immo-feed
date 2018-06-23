import * as request from 'request-promise'

export default function notify(updatedRecords: any[]) {
    const url = process.env.SLACK_WEBHOOK_URL

    if (!url || url.length === 0) throw Error('You have to specify the SLACK_WEBHOOK_URL in your environment variables')

    request.post(url, {
        json: {
            channel: '#immo-feed',
            username: 'immo-feed',
            text: `:house: ${updatedRecords.length} new result(s) found`,
            icon_emoji: ':house:'
        }
    }, (err, response, body) => {
        if (!err ) return console.log('🔔  Slack notification sent')
        return console.log('🔔  Slack notification failed')
    })
}
