import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { Storage } from '../storage/mongo'

const app = express()
const storage = new Storage()

app.use(bodyParser.json())

app.options('*', cors())

app.get('/results', cors(), async (req: any, res: any) => {
    const page = req.query.page
    const records = await storage.findAll(page)
    records.results = records.results.filter((record: any) => !record.hidden)
    res.json(records)
})

app.get('/results/:id', cors(), async (req: any, res: any) => {
    const { id } = req.params
    const record = await storage.findById(id)
    res.json(record)
})

app.post('/results/:id/hide', cors(), async (req: any, res: any) => {
    const { id } = req.params

    try {
        await storage.updateOrCreate({id,  hidden: true })
        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(500)
    }
})

app.listen(process.env.PORT || 3000)
