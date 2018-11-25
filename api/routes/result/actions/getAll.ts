import db from '../../../db'
import { QueryResult } from 'pg'
import { Response, Request } from 'express'

export default function(request: Request, response: Response, next: any) {
  const {
    min_price,
    max_price,
    min_size,
    max_size,
    offset,
    limit,
    search,
  } = request.query

  let searchQuery = ''

  const queryData = [
      min_price,
      max_price,
      min_size,
      max_size,
      offset,
      limit,
  ]

  if (search !== undefined && search.length > 0) {
    const searchTerms = search.split(' ').map((term: string) => `${term}:*`).join('|')

    searchQuery = `
      AND (
        to_tsvector('english', COALESCE(name, ''))      ||
        to_tsvector('english', COALESCE(description, ''))         ||
        to_tsvector('english', COALESCE(price::text, ''))         ||
        to_tsvector('english', COALESCE(size::text, ''))
      ) @@ to_tsquery('english', $7)
    `

    queryData.push(searchTerms)
  }

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
    AND pinned = false
    ${searchQuery}
    ORDER BY created DESC
    LIMIT COALESCE($6, 100)
    OFFSET COALESCE($5, 0)
  `, queryData)
    .then((result: QueryResult) => {
      response.send(result.rows)
    })
    .catch((error: Error) => {
      return next(error)
    })
}
