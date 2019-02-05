import { QueryResult } from 'pg'
import db from '../../../db'
import { Response, Request } from 'express'

export default function(request: Request, response: Response, next: any) {
  const {
    name,
    price,
    size,
    description,
    link,
    photo,
    hidden
  } = request.body

  db.query(`
    INSERT INTO results(name, price, size, description, link, photo)
    VALUES ($1, $2, $3, $4, $5, $6 )
    ON CONFLICT (link)
    DO
      UPDATE
        SET name = COALESCE($1, results.name),
            price = COALESCE($2, results.price),
            size = COALESCE($3, results.size),
            description = COALESCE($4, results.description),
            photo = COALESCE($6, results.photo),
            updated = now(),
            hidden = COALESCE($7, results.hidden)
    RETURNING *
  `,
    [ name, price, size, description, link, photo, hidden ])
  .then((result: QueryResult) => response.json(result.rows))
  .catch((error: Error) => next(error))
}
