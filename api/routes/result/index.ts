import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import upsertResult from './actions/upsert'
import deleteResult from './actions/delete'
import getResult from './actions/getOne'
import getResults from './actions/getAll'

const router = express.Router()

router.options('*', cors())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/', getResults)
router.post('/', upsertResult)
router.get('/:id', getResult)
router.delete('/:id', deleteResult)
router.put('/:id', upsertResult)

export default router
