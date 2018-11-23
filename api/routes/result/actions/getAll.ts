import db from '../../../db'
import { QueryResult } from 'pg'
import { Response, Request } from 'express'

export default function(_: Request, res: Response, next: any) {
  db.query('SELECT * FROM results', [])
    .then((result: QueryResult) => {
      res.send(result.rows)
    })
    .catch((error: Error) => {
      return next(error)
    })
}
