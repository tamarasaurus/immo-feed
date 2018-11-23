import db from '../../../db'
import { QueryResult } from 'pg'
import { Response, Request } from 'express'

export default function (request: Request, response: Response, next: any) {
  const {
    min_price,
    max_price,
    min_size,
    max_size,
    offset,
    limit
  } = request.query

  db.query(`
    SELECT *
    FROM results
    WHERE price BETWEEN COALESCE($1, (
      SELECT MIN(price) from results
    )) AND COALESCE($2, (
      SELECT MAX(price) from results
    ))
    AND size BETWEEN COALESCE($3, (
      SELECT MIN(size) from results
    )) AND COALESCE($4, (
      SELECT MAX(size) from results
    ))
    ORDER BY created DESC
    LIMIT COALESCE($6, 10)
    OFFSET COALESCE($5, 0)
  `, [
      min_price,
      max_price,
      min_size,
      max_size,
      offset,
      limit
    ])
    .then((result: QueryResult) => {
      response.send(result.rows)
    })
    .catch((error: Error) => {
      return next(error)
    })
}
