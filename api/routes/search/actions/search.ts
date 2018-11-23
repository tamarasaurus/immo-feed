import db from '../../../db'
import { QueryResult } from 'pg'
import { Response, Request } from 'express'

export default function(request: Request, response: Response, next: any) {
  const {
    min_price,
    max_price,
    min_size,
    max_size,
    text
  } = request.query

  db.query(`
      SELECT * FROM results
      WHERE price BETWEEN $1 AND $2
      AND size BETWEEN $3 AND $4
    `, [
      min_price,
      max_price,
      min_size,
      max_size
    ])
    .then((result: QueryResult) => {
      response.send(result.rows)
    })
    .catch((error: Error) => {
      return next(error)
    })
}
