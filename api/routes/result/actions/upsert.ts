import db from "../../../db";
import { Response, Request } from "express";

export default function(request: Request, response: Response, next: any) {
  const {
    name,
    price,
    size,
    description,
    link,
    photo,
    hidden,
    pinned,
    seen
  } = request.body;

  console.log('undefined', hidden, pinned, seen)

  // @TODO - Make request data into a validated object
  // @TODO - Dynamically structure the query to only insert not null values in the update
  db.query(`
    INSERT INTO results(name, price, size, description, link, photo)
    VALUES ($1, $2, $3, $4, $5, $6 )
    ON CONFLICT (link)
    DO
      UPDATE
        SET name = $1,
            price = $2,
            size = $3,
            description = $4,
            photo = $6,
            updated = now()
            ,hidden = $7,
            pinned = $8,
            seen = $9
  `,
    [ name,
      price,
      size,
      description,
      link,
      photo,
      hidden,
      pinned,
      seen
    ])
  .then(() => {
    response.status(200).send('OK')
  })
  .catch((error: Error) => {
    return next(error);
  });
}
