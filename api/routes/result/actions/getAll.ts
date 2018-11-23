import db from '../../../db'
import { QueryResult } from 'pg'
import { Response, Request } from 'express'

export default function(request: Request, response: Response, next: any) {
  const { offset } = request.params

  console.log('offset', offset)

  db.query(`
    SELECT * FROM results
    ORDER BY created DESC
    LIMIT 10
    OFFSET $1
  `, [ (offset || 0) ])
    .then((result: QueryResult) => {
      response.send(result.rows)
    })
    .catch((error: Error) => {
      return next(error)
    })
}
