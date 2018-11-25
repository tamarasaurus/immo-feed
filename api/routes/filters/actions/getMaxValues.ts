import db from '../../../db'
import { QueryResult } from 'pg'
import { Response, Request } from 'express'

export default function(request: Request, response: Response, next: any) {
  db.query(`
    SELECT
      MIN(size) as min_size,
      MAX(size) as max_size,
      ROUND(MIN(price)) as min_price,
      ROUND(MAX(price)) as max_price,
      COUNT(id) as total
    FROM results
  `, [])
    .then((result: QueryResult) => {
      response.send(result.rows)
    })
    .catch((error: Error) => {
      return next(error)
    })
}
