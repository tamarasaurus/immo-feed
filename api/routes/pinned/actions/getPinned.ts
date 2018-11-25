import db from '../../../db'
import { QueryResult } from 'pg'
import { Response, Request } from 'express'

export default function(request: Request, response: Response, next: any) {
  db.query(`
    SELECT *
    FROM results
    WHERE pinned = true
    ORDER BY updated ASC
  `, [])
    .then((result: QueryResult) => {
      response.send(result.rows)
    })
    .catch((error: Error) => {
      return next(error)
    })
}
