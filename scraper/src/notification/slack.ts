import * as request from 'request-promise'

export default function notify(updatedRecords: any[]) {
    const url = process.env.SLACK_WEBHOOK_URL

    if (!url || url.length === 0) throw Error('You have to specify the SLACK_WEBHOOK_URL in your environment variables')

    return request.post(url, {
        json: {
            channel: '#immo-feed',
            username: 'immo-feed',
            text: `:house: ${updatedRecords.length} new result(s) found`,
            icon_emoji: ':house:'
        }
    })
    .then(() => console.log('🔔  Slack notification sent'))
    .catch(err => console.log('🔔  Slack notification failed'))
}
