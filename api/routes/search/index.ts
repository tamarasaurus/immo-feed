import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import search from './actions/search'

const router = express.Router()

router.options('*', cors())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/', search)

export default router
