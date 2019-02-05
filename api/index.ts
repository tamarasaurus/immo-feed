import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import result from './routes/result'
import filters from './routes/filters'

const app = express()

app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next()
})
app.use('/results', cors(), result)
app.use('/filters', cors(), filters)
app.listen(process.env.PORT || 8000)
