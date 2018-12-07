import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import getMaxValues from './actions/getMaxValues'

const router = express.Router()

router.options('*', cors())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/', getMaxValues)

export default router
