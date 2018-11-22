import * as express from 'express'
import createResult from './actions/upsert'
import deleteResult from './actions/delete'
import getResult from './actions/getOne'
import getResults from './actions/getAll'
import upsertResult from './actions/upsert'

const router = express.Router();

router.get('/', getResults)
router.get('/:id', getResult)
router.post('/', createResult)
router.delete('/', deleteResult)
router.put('/:id', upsertResult)

export default router
