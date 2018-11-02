import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { parse } from 'json2csv'
import { Storage } from '../storage/postgres'
import { groupBy, pickBy, identity } from 'lodash'

const app = express()
const storage = new Storage()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('*', cors())

app.get('/results', cors(), async (req: any, res: any) => {
    const { page, filterValue, minPrice, maxPrice, minSize, maxSize, sort } = req.query
    const response = await storage.findAll({page, filter: filterValue, minPrice, maxPrice, minSize, maxSize, sort})
    response.results = groupBy(response.results, (result: any) => result.pinned ? 'pinned' : 'all' )
    res.json(response)
})

app.get('/results/:id', cors(), async (req: any, res: any) => {
    const { id } = req.params
    const record = await storage.findById(id)
    res.json(record)
})

app.post('/results/:id', cors(), async (req: any, res: any) => {
    const { id } = req.params
    const { hidden, pinned, seen } = req.body;

    console.log('body', req.body, req.query)
    const data = pickBy({ hidden, pinned, seen }, identity)

    try {
        await storage.update(data, id)
        res.sendStatus(200)
    } catch (e) {
        console.log('Error hiding result', e)
        res.sendStatus(500)
    }
})

app.post('/results/:id/pin', cors(), async (req: any, res: any) => {
    const { id } = req.params

    try {
        await storage.update({ pinned: true }, id)
        res.sendStatus(200)
    } catch (e) {
        console.log('Error pinning result', e)
        res.sendStatus(500)
    }
})

app.post('/results/:id/unpin', cors(), async (req: any, res: any) => {
    const { id } = req.params

    try {
        await storage.update({ pinned: false }, id)
        res.sendStatus(200)
    } catch (e) {
        console.log('Error pinning result', e)
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
