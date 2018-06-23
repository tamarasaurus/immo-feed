import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Storage } from '../storage/mongo'

const app = express()
const storage = new Storage()

app.use(bodyParser.json())

app.get("/results", async (req: any, res: any) => {
    const records = await storage.findAll();
    res.json(records.filter((record: any) => !record.hidden));
});

app.get('/results/:id', async (req: any, res: any) => {
    const { id } = req.params
    const record = await storage.findById(id);
    res.json(record)
})

app.delete('/results/:id', (req: any, res: any) => {
    const { id } = req.params

    try {
        storage.updateOrCreate({id,  hidden: true });
    } catch (e) {
        res.status(500)
    }

    res.status(200)
})

app.listen(process.env.PORT || 3000)
