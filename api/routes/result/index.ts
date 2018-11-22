import * as express from 'express'
import createResult from './actions/create'
import deleteResult from './actions/delete'
import getResult from './actions/getOne'
import getResults from './actions/getAll'
import updateResult from './actions/update'

const router = express.Router();

router.get('/', getResults)
router.get('/:id', getResult)
router.post('/', createResult)
router.delete('/', deleteResult)
router.put('/:id', updateResult)

export default router
