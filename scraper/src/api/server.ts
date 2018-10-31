import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { parse } from 'json2csv'
import { Storage } from '../storage/postgres'

const app = express()
const storage = new Storage()

app.use(bodyParser.json())

app.options('*', cors())

app.get('/results', cors(), async (req: any, res: any) => {
    const page = req.query.page
    const filter = req.query.filter
    const results = await storage.findAll(page, filter)
    res.json(results)
})

app.get('/results/:id', cors(), async (req: any, res: any) => {
    const { id } = req.params
    const record = await storage.findById(id)
    res.json(record)
})

app.post('/results/:id/hide', cors(), async (req: any, res: any) => {
    const { id } = req.params

    try {
        await storage.update({ hidden: true }, id)
        res.sendStatus(200)
    } catch (e) {
        console.log('Error hiding result', e)
        res.sendStatus(500)
    }
})

app.get('/export/csv', cors(), async (req: any, res: any) => {
    const { since, download } = req.query
    let records = await storage.findUpdatedSince(since)

    const parsedRecords = parse(records, {
        fields: [
            'createdAt',
            'updatedAt',
            'name',
            'description',
            'price',
            'size',
            'link',
            'photos'
        ]
    })

    if (!!download) {
        const fileName = `attachment; filename=immo-feed-${new Date().getTime()}.csv`
        res.setHeader('Content-disposition', fileName);
        res.set('Content-Type', 'text/csv');
    }

    return res.status(200).send(parsedRecords);
})

app.get('/export/json', cors(), async (req: any, res: any) => {
    let { since, download } = req.query

    if (!since) since = new Date('1/1/1970')

    let records = await storage.findUpdatedSince(since)

    if (!!download) {
        const fileName = `attachment; filename=immo-feed-${new Date().getTime()}.json`
        res.setHeader('Content-disposition', fileName);
        res.set('Content-Type', 'application/json');
    }

    res.json(records)
})

app.listen(process.env.PORT || 8000)
