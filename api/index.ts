import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { QueryResult } from 'pg'
import result from './routes/result'
import filters from './routes/filters'

import db from './db'

const app = express()

db.query(
  `CREATE TABLE IF NOT EXISTS results(
    id SERIAL,
    name TEXT NOT NULL,
    description TEXT,
    size FLOAT,
    price INTEGER,
    link TEXT PRIMARY KEY,
    created timestamp NOT NULL DEFAULT current_timestamp,
    updated timestamp NOT NULL DEFAULT current_timestamp,
    photo TEXT,
    hidden BOOLEAN NOT NULL DEFAULT false,
    pinned BOOLEAN NOT NULL DEFAULT false,
    seen BOOLEAN NOT NULL DEFAULT false
   )`, [])
  .then((results: QueryResult) => {
    console.log(results)
  })
  .catch((error: Error) => {
      console.error('Error creating table', error)
  })

app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/results', cors(), result)
app.use('/filters', cors(), filters)
app.listen(process.env.PORT || 8000)
